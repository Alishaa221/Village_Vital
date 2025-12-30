"use client"

import type React from "react"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Droplets, AlertTriangle, CheckCircle, TrendingUp, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts"

// Mock data for water quality trends
const waterQualityTrends = [
  { month: "Jan", turbidity: 8.2, ph: 7.1, contamination: 15 },
  { month: "Feb", turbidity: 9.1, ph: 6.9, contamination: 18 },
  { month: "Mar", turbidity: 7.8, ph: 7.2, contamination: 12 },
  { month: "Apr", turbidity: 6.5, ph: 7.4, contamination: 8 },
  { month: "May", turbidity: 8.9, ph: 7.0, contamination: 16 },
  { month: "Jun", turbidity: 5.2, ph: 7.3, contamination: 6 },
]

const recentTests = [
  {
    id: 1,
    location: "Main Well - Kamakhya Village",
    turbidity: 8.5,
    ph: 7.1,
    contamination: "Low",
    risk: "low",
    date: "2024-01-15",
    tester: "Water Inspector Ram",
  },
  {
    id: 2,
    location: "River Source - Majuli Village",
    turbidity: 15.2,
    ph: 6.8,
    contamination: "Moderate",
    risk: "moderate",
    date: "2024-01-14",
    tester: "Health Worker Priya",
  },
  {
    id: 3,
    location: "Community Pump - Dibrugarh",
    turbidity: 22.8,
    ph: 6.2,
    contamination: "High",
    risk: "high",
    date: "2024-01-13",
    tester: "Dr. Sharma",
  },
]

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "low":
      return "text-green-600 bg-green-100"
    case "moderate":
      return "text-yellow-600 bg-yellow-100"
    case "high":
      return "text-red-600 bg-red-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

const getRiskLevel = (turbidity: number) => {
  if (turbidity <= 10) return { level: "low", color: "green", percentage: 25 }
  if (turbidity <= 20) return { level: "moderate", color: "yellow", percentage: 60 }
  return { level: "high", color: "red", percentage: 90 }
}

export default function WaterQualityPage() {
  const [date, setDate] = useState<Date>()
  const [turbidity, setTurbidity] = useState("")
  const [ph, setPh] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentRisk = turbidity ? getRiskLevel(Number.parseFloat(turbidity)) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="max-w-2xl mx-auto">
            <Card className="text-center animate-slide-up">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Water Quality Test Submitted</h2>
                <p className="text-muted-foreground mb-6">
                  Your water quality test results have been recorded and will be analyzed. Alerts will be sent if
                  immediate action is required.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setIsSubmitted(false)}>Submit Another Test</Button>
                  <Button variant="outline" asChild>
                    <a href="/dashboard">Return to Dashboard</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-balance">Water Quality Monitoring</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and report water quality metrics to ensure safe drinking water
            </p>
          </div>

          <Tabs defaultValue="submit" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="submit">Submit Test</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="history">Test History</TabsTrigger>
            </TabsList>

            {/* Submit Test Tab */}
            <TabsContent value="submit" className="space-y-8">
              <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                {/* Basic Information */}
                <Card className="animate-slide-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="h-5 w-5" />
                      Water Source Information
                    </CardTitle>
                    <CardDescription>Provide details about the water source being tested</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="test-date">Test Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : "Select test date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="source-type">Source Type</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select water source type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="well">Well</SelectItem>
                            <SelectItem value="borehole">Borehole</SelectItem>
                            <SelectItem value="river">River</SelectItem>
                            <SelectItem value="pond">Pond</SelectItem>
                            <SelectItem value="tap">Tap Water</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location/Village</Label>
                        <Input id="location" placeholder="Enter location or village name" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="coordinates">GPS Coordinates (Optional)</Label>
                        <Input id="coordinates" placeholder="e.g., 26.1445, 91.7362" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Water Quality Metrics */}
                <Card className="animate-slide-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Quality Measurements
                    </CardTitle>
                    <CardDescription>Enter the measured water quality parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="turbidity">Turbidity (NTU)</Label>
                        <Input
                          id="turbidity"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 8.5"
                          value={turbidity}
                          onChange={(e) => setTurbidity(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Normal range: 0-10 NTU (lower is better)</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ph">pH Level</Label>
                        <Input
                          id="ph"
                          type="number"
                          step="0.1"
                          min="0"
                          max="14"
                          placeholder="e.g., 7.2"
                          value={ph}
                          onChange={(e) => setPh(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Safe range: 6.5-8.5 pH</p>
                      </div>
                    </div>

                    {/* Risk Indicator */}
                    {currentRisk && (
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Risk Assessment</h4>
                          <Badge className={getRiskColor(currentRisk.level)}>
                            {currentRisk.level.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Risk Level</span>
                            <span>{currentRisk.percentage}%</span>
                          </div>
                          <Progress
                            value={currentRisk.percentage}
                            className={`h-2 ${
                              currentRisk.color === "green"
                                ? "[&>div]:bg-green-500"
                                : currentRisk.color === "yellow"
                                  ? "[&>div]:bg-yellow-500"
                                  : "[&>div]:bg-red-500"
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="chlorine">Chlorine Level (mg/L)</Label>
                        <Input id="chlorine" type="number" step="0.01" placeholder="e.g., 0.5" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bacteria">Bacterial Count</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bacterial level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None Detected</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any observations, unusual conditions, or additional information..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" asChild>
                    <a href="/dashboard">Cancel</a>
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="min-w-32">
                    {isSubmitting ? "Submitting..." : "Submit Test Results"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="animate-slide-up">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Safe Sources</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">65%</div>
                    <p className="text-xs text-muted-foreground">58 out of 89 sources</p>
                  </CardContent>
                </Card>

                <Card className="animate-slide-up">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Moderate Risk</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">25%</div>
                    <p className="text-xs text-muted-foreground">22 sources need monitoring</p>
                  </CardContent>
                </Card>

                <Card className="animate-slide-up">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">10%</div>
                    <p className="text-xs text-muted-foreground">9 sources need immediate action</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="animate-slide-up">
                  <CardHeader>
                    <CardTitle>Turbidity Trends</CardTitle>
                    <CardDescription>Monthly average turbidity levels (NTU)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={waterQualityTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="turbidity"
                          stroke="hsl(var(--chart-1))"
                          fill="hsl(var(--chart-1))"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="animate-slide-up">
                  <CardHeader>
                    <CardTitle>pH Level Trends</CardTitle>
                    <CardDescription>Monthly average pH levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={waterQualityTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[6, 8]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="ph" stroke="hsl(var(--chart-2))" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card className="animate-slide-up">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Water Quality Tests</CardTitle>
                    <CardDescription>Latest test results from all sources</CardDescription>
                  </div>
                  <Button asChild>
                    <a href="/reports">
                      <Eye className="h-4 w-4 mr-2" />
                      View All Reports
                    </a>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTests.map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRiskColor(test.risk)}`}
                          >
                            <Droplets className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-medium">{test.location}</h4>
                            <p className="text-sm text-muted-foreground">
                              Tested by {test.tester} on {test.date}
                            </p>
                            <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                              <span>Turbidity: {test.turbidity} NTU</span>
                              <span>pH: {test.ph}</span>
                              <span>Contamination: {test.contamination}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getRiskColor(test.risk)}>{test.risk.toUpperCase()} RISK</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
