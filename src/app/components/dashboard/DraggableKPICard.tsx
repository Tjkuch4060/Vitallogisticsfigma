import React, { useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { motion, useSpring, useTransform } from 'motion/react';

export interface KPIItem {
  id: string;
  title: string;
  value: number;
  prefix?: string;
  change: string;
  icon: LucideIcon;
  visible: boolean;
  trend?: number[];
}

interface DraggableKPICardProps {
  id: string;
  index: number;
  item: KPIItem;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

const ItemType = 'KPI_CARD';

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  
  // Format the number based on whether it has decimals
  const display = useTransform(spring, (current) => {
    // Check if original value had decimals
    const hasDecimals = value % 1 !== 0;
    return prefix + current.toLocaleString('en-US', { 
        minimumFractionDigits: hasDecimals ? 2 : 0, 
        maximumFractionDigits: 2 
    });
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export const DraggableKPICard = ({ id, index, item, moveCard }: DraggableKPICardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ handlerId }, drop] = useDrop({
    accept: ItemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number; id: string; type: string }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
         return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
         return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));
  
  const Icon = item.icon;
  const trendData = item.trend ? item.trend.map((val, i) => ({ i, value: val })) : [];
  const isPositive = item.change.includes('+');

  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId} className="cursor-move h-full">
        <Card className="h-full hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{item.title}</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-lg">
                <Icon className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
                <AnimatedNumber value={item.value} prefix={item.prefix} />
            </div>
            
            <div className="flex items-center justify-between mt-1">
                <p className={cn("text-xs flex items-center gap-1", isPositive ? "text-emerald-600" : "text-red-600")}>
                    {item.change}
                </p>
            </div>

            {trendData.length > 0 && (
                <div className="h-[40px] w-full mt-4 -mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke={isPositive ? "#10b981" : "#ef4444"} 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill={`url(#gradient-${id})`} 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
};
