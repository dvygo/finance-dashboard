import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { FileSearch, PieChart, Radar, Target} from "lucide-react";
import { AreaVariant } from "@/components/area-variant";
import { BarVariant } from "@/components/bar-variant";
import { LineVariant } from "@/components/line-variant";
import { useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectValue,
    SelectItem
} from "@/components/ui/select"
import { PieVariant } from "@/components/pie-variant";


type Props = {
    data?: {
        name: string;
        value: number;
    }[];
};

export const SpendingPie = ({ data = []}: Props) => {
    const [chartType, setChartType] = useState("pipe");

    const onTypeChange = (type: string) => {
        setChartType(type);
    };

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle className="text-xl line-clamp-1">
                    Categories
                </CardTitle>
                <Select
                    defaultValue={chartType}
                    onValueChange={onTypeChange}
                >
                    <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
                        <SelectValue placeholder="Chart type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pie">
                            <div className="flex items-center">
                            <PieChart className="size-4 mr-2 shrink-0"/>
                            <p className="line-clamp-1">
                                Pie Chart
                            </p>
                            </div> 
                        </SelectItem>
                        <SelectItem value="radar">
                            <div className="flex items-center">
                            <Radar className="size-4 mr-2 shrink-0"/>
                            <p className="line-clamp-1">
                                Radar Chart
                            </p>
                            </div> 
                        </SelectItem>
                        <SelectItem value="radial">
                            <div className="flex items-center">
                            <Target className="size-4 mr-2 shrink-0"/>
                            <p className="line-clamp-1">
                                Radial Chart
                            </p>
                            </div> 
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
                        <FileSearch className="size-6 text-nuted-foreground"/>
                        <p className="text-muted-foreground text-sm">
                            No data for this period
                        </p>
                    </div>
                ) : (
                    <>
                        {chartType === "pie" && <PieVariant data={data} />}
                        {chartType === "radar" && <AreaVariant data={data} />}
                        {chartType === "radial" && <BarVariant data={data} />}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

