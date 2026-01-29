import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier } from 'dnd-core';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../ui/utils';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export interface KPIItem {
  id: string;
  title: string;
  value: number;
  prefix?: string;
  change: string;
  changePercent?: number; // Period-over-period change percentage
  trend?: 'up' | 'down'; // Trend direction
  icon: LucideIcon;
  visible: boolean;
  trendData?: number[];
}

interface DraggableKPICardProps {
  id: string;
  index: number;
  item: KPIItem;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  id: string;
  index: number;
  type: string;
}

const ItemType = 'KPI_CARD';

export const DraggableKPICard = ({ id, index, item, moveCard }: DraggableKPICardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(draggedItem: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset) {
        return;
      }
      
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
         return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
         return;
      }

      moveCard(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: (): DragItem => {
      return { id, index, type: ItemType };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));
  
  const Icon = item.icon;
  const trendData = item.trendData ? item.trendData.map((val, i) => ({ i, value: val })) : [];
  const isPositive = item.trend === 'up' || (item.changePercent !== undefined ? item.changePercent >= 0 : item.change.includes('+'));
  const changePercent = item.changePercent;

  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId} className="cursor-move h-full group/kpi">
        <Card className="h-full group-hover/kpi:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-[0.1em]">{item.title}</CardTitle>
            <div className="p-3 bg-emerald-100 rounded-full group-hover/kpi:bg-emerald-200 transition-colors">
                <Icon size={20} className="text-emerald-600 group-hover/kpi:text-emerald-700 group-hover/kpi:rotate-6 transition-all" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedNumber 
                  value={item.value} 
                  prefix={item.prefix || ''} 
                  decimals={item.value % 1 !== 0 ? 2 : 0}
                />
            </div>
            
            <div className="flex items-center justify-between mt-2">
                <p className={cn("text-xs font-bold flex items-center gap-1 px-2 py-0.5 rounded-full", 
                    isPositive ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50")}>
                    {changePercent !== undefined && (
                      isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )
                    )}
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
