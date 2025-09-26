"use client"

import { useState, useEffect, memo, useRef, useCallback } from "react"
import { 
  Activity, 
  Calendar, 
  FileText, 
  Inbox, 
  Mic, 
  MicOff, 
  Users, 
  Clock, 
  Shield, 
  Zap, 
  Brain,
  ArrowRight, 
  Stethoscope,
  Heart,
  Pill,
  AlertTriangle,
  TrendingUp,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  CheckCircle,
  AlertCircle,
  Info,
  Menu,
  X,
  Plus,
  Edit,
  Eye,
  Download,
  Share2,
  Printer,
  MessageSquare,
  Video,
  Phone,
  User,
  Settings,
  LogOut,
  Sparkles,
  Wand2,
  BookOpen,
  ClipboardList,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Database,
  Cloud,
  Wifi,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

interface PatientData {
  id: string
  name: string
  age: number
  mrn: string
  dob: string
  nextAppointment?: string
  lastVisit: string
  chiefComplaint: string
  status: "active" | "waiting" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
  vitals: {
    bloodPressure: string
    heartRate: number
    temperature: number
    oxygenSat: number
    respiratoryRate: number
  }
  allergies: string[]
  medications: Array<{
    name: string
    dosage: string
    frequency: string
  }>
  conditions: string[]
  riskScore: number
}

interface VoiceSessionData {
  isRecording: boolean
  transcript: string
  confidence: number
  duration: number
  autoSaveEnabled: boolean
}

interface Message {
  id: string
  from: string
  subject: string
  preview: string
  time: string
  priority: "low" | "medium" | "high"
  read: boolean
  type: "patient" | "lab" | "pharmacy" | "colleague"
}

interface EHRPreviewProps {
  onContinueJourney?: () => void
}

const EHRPreview = memo(function EHRPreview({ onContinueJourney }: EHRPreviewProps = {}) {
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [voiceSession, setVoiceSession] = useState<VoiceSessionData>({
    isRecording: false,
    transcript: "",
    confidence: 0,
    duration: 0,
    autoSaveEnabled: true
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeWorkflow, setActiveWorkflow] = useState<"before" | "after">("before")
  const [isCompactView, setIsCompactView] = useState(false)

  // Mock data
  const mockPatients: PatientData[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      age: 34,
      mrn: "MRN-2024-001",
      dob: "1989-03-15",
      nextAppointment: "Today 2:30 PM",
      lastVisit: "2024-01-15",
      chiefComplaint: "Annual physical exam, discuss new medication",
      status: "active",
      priority: "medium",
      vitals: {
        bloodPressure: "120/80",
        heartRate: 72,
        temperature: 98.6,
        oxygenSat: 98,
        respiratoryRate: 16
      },
      allergies: ["Penicillin", "Shellfish"],
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily" }
      ],
      conditions: ["Hypertension", "Type 2 Diabetes"],
      riskScore: 65
    },
    {
      id: "2", 
      name: "Michael Chen",
      age: 67,
      mrn: "MRN-2024-002",
      dob: "1956-08-22",
      nextAppointment: "Today 3:15 PM",
      lastVisit: "2024-01-08",
      chiefComplaint: "Chest pain evaluation, cardiac follow-up",
      status: "waiting",
      priority: "high",
      vitals: {
        bloodPressure: "145/92",
        heartRate: 88,
        temperature: 98.2,
        oxygenSat: 96,
        respiratoryRate: 18
      },
      allergies: ["Aspirin"],
      medications: [
        { name: "Metoprolol", dosage: "50mg", frequency: "Twice daily" },
        { name: "Atorvastatin", dosage: "40mg", frequency: "Once daily" }
      ],
      conditions: ["Coronary Artery Disease", "Hyperlipidemia"],
      riskScore: 85
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      age: 28,
      mrn: "MRN-2024-003", 
      dob: "1995-12-03",
      lastVisit: "2024-01-10",
      chiefComplaint: "Prenatal checkup, 24 weeks gestation",
      status: "completed",
      priority: "medium",
      vitals: {
        bloodPressure: "118/75",
        heartRate: 80,
        temperature: 98.4,
        oxygenSat: 99,
        respiratoryRate: 14
      },
      allergies: [],
      medications: [
        { name: "Prenatal Vitamins", dosage: "1 tablet", frequency: "Once daily" }
      ],
      conditions: ["Pregnancy - 24 weeks"],
      riskScore: 25
    }
  ]

  const mockMessages: Message[] = [
    {
      id: "1",
      from: "Lab Department",
      subject: "Lab Results Available - Sarah Johnson",
      preview: "Complete blood count and metabolic panel results are ready for review...",
      time: "2 min ago",
      priority: "high",
      read: false,
      type: "lab"
    },
    {
      id: "2", 
      from: "Michael Chen",
      subject: "Questions about new medication",
      preview: "Dr. Smith, I have some questions about the new blood pressure medication...",
      time: "15 min ago",
      priority: "medium",
      read: false,
      type: "patient"
    },
    {
      id: "3",
      from: "Pharmacy",
      subject: "Prior Authorization Required",
      preview: "Prior auth needed for patient Emma Rodriguez - Prescription #RX789456",
      time: "1 hour ago",
      priority: "medium",
      read: true,
      type: "pharmacy"
    },
    {
      id: "4",
      from: "Dr. Anderson",
      subject: "Consultation Request",
      preview: "Could you review this case? Patient has complex cardiac history...",
      time: "2 hours ago",
      priority: "low",
      read: true,
      type: "colleague"
    }
  ]

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Simulate voice recording
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (voiceSession.isRecording) {
      interval = setInterval(() => {
        setVoiceSession(prev => ({
          ...prev,
          duration: prev.duration + 1,
          transcript: prev.transcript + (Math.random() > 0.7 ? " medication compliance discussed" : ""),
          confidence: 85 + Math.random() * 10
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [voiceSession.isRecording])

  const startVoiceRecording = () => {
    setVoiceSession(prev => ({
      ...prev,
      isRecording: true,
      transcript: "Patient presents for follow-up visit. Reports good",
      duration: 0
    }))
    setIsVoiceActive(true)
  }

  const stopVoiceRecording = () => {
    setVoiceSession(prev => ({
      ...prev,
      isRecording: false
    }))
    setIsVoiceActive(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500"
      case "high": return "bg-orange-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-500 bg-green-500/20"
      case "waiting": return "text-yellow-500 bg-yellow-500/20"
      case "completed": return "text-blue-500 bg-blue-500/20"
      default: return "text-gray-500 bg-gray-500/20"
    }
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Workflow Toggle */}
      <div className="mb-6 flex justify-center">
        <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-lg p-1">
          <div className="flex gap-1">
            <Button
              onClick={() => setActiveWorkflow("before")}
              variant={activeWorkflow === "before" ? "default" : "ghost"}
              size="sm"
              className="text-xs font-medium"
            >
              Traditional Workflow
            </Button>
            <Button
              onClick={() => setActiveWorkflow("after")}
              variant={activeWorkflow === "after" ? "default" : "ghost"}
              size="sm"
              className="text-xs font-medium"
            >
              Ignite AI Workflow
            </Button>
          </div>
        </div>
      </div>

      {activeWorkflow === "before" ? (
        /* Traditional Workflow */
        <div className="rounded-2xl border border-white/20 overflow-hidden shadow-2xl bg-card/30 backdrop-blur-sm">
          {/* Traditional Header */}
          <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-gray-600 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Legacy EHR System</h3>
                  <p className="text-xs text-muted-foreground">Multiple clicks, manual entry required</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                Traditional
              </Badge>
            </div>
          </div>

          {/* Traditional Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manual Data Entry */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-gray-700 dark:text-gray-300">Manual Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• 15+ minutes per patient note</p>
                    <p>• Multiple system logins required</p>
                    <p>• Manual template selection</p>
                    <p>• Repetitive data entry</p>
                    <p>• No real-time assistance</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Average documentation time: <span className="font-semibold text-red-600">18 minutes</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Multiple Systems */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-gray-700 dark:text-gray-300">System Fragmentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                      <p className="font-medium text-red-700 dark:text-red-400">Lab System</p>
                      <p className="text-red-600 dark:text-red-500">Separate login</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                      <p className="font-medium text-red-700 dark:text-red-400">Imaging</p>
                      <p className="text-red-600 dark:text-red-500">Different interface</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                      <p className="font-medium text-red-700 dark:text-red-400">Pharmacy</p>
                      <p className="text-red-600 dark:text-red-500">Manual faxing</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                      <p className="font-medium text-red-700 dark:text-red-400">Scheduling</p>
                      <p className="text-red-600 dark:text-red-500">No integration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traditional Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">45%</p>
                  <p className="text-xs text-red-700 dark:text-red-500">Time on documentation</p>
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">68%</p>
                  <p className="text-xs text-orange-700 dark:text-orange-500">Physician burnout</p>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">32%</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-500">Patient satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Ignite AI Workflow */
        <div className="rounded-2xl border border-white/20 overflow-hidden shadow-2xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-fire-500/20 via-ember-500/20 to-flame-500/20 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-fire-500 to-ember-500 flex items-center justify-center shadow-fire animate-pulse-glow">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gradient-fire bg-gradient-to-r from-fire-500 to-ember-500 bg-clip-text text-transparent">
                    Ignite EHR Platform
                  </h3>
                  <p className="text-sm text-muted-foreground">Dr. Sarah Martinez - Internal Medicine</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-500 font-medium">AI Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-blue-500 font-medium">HIPAA Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-purple-500 font-medium">Cloud Sync</span>
                </div>
                <Badge className="bg-gradient-to-r from-fire-500 to-ember-500 text-white border-0">
                  AI-Powered
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation Sidebar & Main Content */}
          <div className="flex">
            {/* Compact Navigation */}
            <div className={`${isCompactView ? 'w-16' : 'w-64'} bg-background/95 backdrop-blur-sm border-r border-white/10 transition-all duration-300`}>
              <div className="p-4 border-b border-white/10">
                <Button
                  onClick={() => setIsCompactView(!isCompactView)}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Menu className="h-4 w-4" />
                  {!isCompactView && <span className="ml-2">Menu</span>}
                </Button>
              </div>
              
              <nav className="p-2 space-y-1">
                {[
                  { id: 'dashboard', icon: BarChart3, label: 'Dashboard', count: null },
                  { id: 'patients', icon: Users, label: 'Patients', count: mockPatients.length },
                  { id: 'calendar', icon: Calendar, label: 'Schedule', count: 12 },
                  { id: 'inbox', icon: Inbox, label: 'Messages', count: mockMessages.filter(m => !m.read).length },
                  { id: 'voice', icon: Mic, label: 'Voice Notes', count: null },
                  { id: 'analytics', icon: TrendingUp, label: 'Analytics', count: null },
                ].map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    variant={activeView === item.id ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start ${isCompactView ? 'px-2' : 'px-3'}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCompactView && (
                      <>
                        <span className="ml-2 flex-1 text-left">{item.label}</span>
                        {item.count && (
                          <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                            {item.count}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                ))}
              </nav>

              {/* Quick Actions */}
              {!isCompactView && (
                <div className="mt-6 px-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Quick Actions</p>
                  <div className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Plus className="h-4 w-4" />
                      <span className="ml-2">New Patient</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Edit className="h-4 w-4" />
                      <span className="ml-2">Quick Note</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Video className="h-4 w-4" />
                      <span className="ml-2">Telehealth</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-background/95 backdrop-blur-sm">
              {/* Top Status Bar */}
              <div className="border-b border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Current Time:</span>
                      <span className="ml-2 font-medium">{formatTime(currentTime)}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="text-sm">
                      <span className="text-muted-foreground">Today's Patients:</span>
                      <span className="ml-2 font-medium text-green-500">{mockPatients.length}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="text-sm">
                      <span className="text-muted-foreground">AI Efficiency:</span>
                      <span className="ml-2 font-medium text-fire-500">+234%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Voice Recording Button */}
                    <Button
                      onClick={voiceSession.isRecording ? stopVoiceRecording : startVoiceRecording}
                      variant={voiceSession.isRecording ? "destructive" : "default"}
                      size="sm"
                      className="gap-2"
                    >
                      {voiceSession.isRecording ? (
                        <>
                          <MicOff className="h-4 w-4" />
                          Stop Recording ({voiceSession.duration}s)
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          Start Voice Note
                        </>
                      )}
                    </Button>
                    
                    {/* AI Assistant */}
                    <Button variant="outline" size="sm" className="gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      AI Assistant
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content based on active view */}
              <ScrollArea className="h-[600px]">
                <div className="p-6">
                  {activeView === 'dashboard' && (
                    <div className="space-y-6">
                      {/* AI Insights Panel */}
                      <Card className="border-fire-200/50 bg-gradient-to-r from-fire-50/50 to-ember-50/50 dark:from-fire-900/20 dark:to-ember-900/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Wand2 className="h-5 w-5 text-fire-500" />
                            <CardTitle className="text-fire-700 dark:text-fire-400">AI Clinical Insights</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                <span className="text-sm font-medium">High-Risk Patients</span>
                              </div>
                              <p className="text-2xl font-bold text-amber-600">2</p>
                              <p className="text-xs text-muted-foreground">Require immediate attention</p>
                            </div>
                            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium">Care Gaps</span>
                              </div>
                              <p className="text-2xl font-bold text-green-600">5</p>
                              <p className="text-xs text-muted-foreground">Preventive care opportunities</p>
                            </div>
                            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Efficiency</span>
                              </div>
                              <p className="text-2xl font-bold text-blue-600">94%</p>
                              <p className="text-xs text-muted-foreground">Documentation accuracy</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Today's Schedule & Quick Stats */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Today's Patients */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-primary" />
                              Today's Schedule
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {mockPatients.slice(0, 3).map((patient) => (
                              <div key={patient.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                  <p className="font-medium text-sm">{patient.name}</p>
                                  <p className="text-xs text-muted-foreground">{patient.chiefComplaint}</p>
                                </div>
                                <div className="text-right">
                                  <Badge className={getStatusColor(patient.status)}>
                                    {patient.status}
                                  </Badge>
                                  {patient.nextAppointment && (
                                    <p className="text-xs text-muted-foreground mt-1">{patient.nextAppointment}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* Performance Metrics */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                              <BarChart3 className="h-5 w-5 text-primary" />
                              Performance Metrics
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Documentation Speed</span>
                                <span className="text-green-600">+175%</span>
                              </div>
                              <Progress value={85} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Patient Satisfaction</span>
                                <span className="text-green-600">4.8/5.0</span>
                              </div>
                              <Progress value={96} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Clinical Accuracy</span>
                                <span className="text-green-600">98.2%</span>
                              </div>
                              <Progress value={98} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Time Saved Today</span>
                                <span className="text-fire-600 font-medium">4.2 hours</span>
                              </div>
                              <Progress value={70} className="h-2" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {activeView === 'patients' && (
                    <div className="space-y-6">
                      {/* Search and Filters */}
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input 
                            placeholder="Search patients..." 
                            className="w-full"
                          />
                        </div>
                        <Button variant="outline" size="default">
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                      </div>

                      {/* Patient List */}
                      <div className="grid gap-4">
                        {mockPatients.map((patient) => (
                          <Card 
                            key={patient.id} 
                            className={`cursor-pointer transition-all hover:shadow-lg ${
                              selectedPatient?.id === patient.id ? 'ring-2 ring-fire-500 bg-fire-50/50 dark:bg-fire-900/20' : ''
                            }`}
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar>
                                    <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold">{patient.name}</h3>
                                      <Badge className={getStatusColor(patient.status)}>
                                        {patient.status}
                                      </Badge>
                                      <div className={`h-2 w-2 rounded-full ${getPriorityColor(patient.priority)}`} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Age {patient.age} • MRN: {patient.mrn}
                                    </p>
                                    <p className="text-sm">{patient.chiefComplaint}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Heart className={`h-4 w-4 ${patient.riskScore > 70 ? 'text-red-500' : patient.riskScore > 40 ? 'text-yellow-500' : 'text-green-500'}`} />
                                    <span className="text-sm font-medium">Risk: {patient.riskScore}%</span>
                                  </div>
                                  {patient.nextAppointment && (
                                    <p className="text-xs text-muted-foreground">{patient.nextAppointment}</p>
                                  )}
                                  <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Selected Patient Details */}
                      {selectedPatient && (
                        <Card className="mt-6">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>Patient Details: {selectedPatient.name}</span>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Chart
                                </Button>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Tabs defaultValue="overview" className="w-full">
                              <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                                <TabsTrigger value="medications">Medications</TabsTrigger>
                                <TabsTrigger value="history">History</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="overview" className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">Demographics</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date of Birth:</span>
                                        <span>{selectedPatient.dob}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Age:</span>
                                        <span>{selectedPatient.age} years</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">MRN:</span>
                                        <span>{selectedPatient.mrn}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Visit:</span>
                                        <span>{selectedPatient.lastVisit}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-3">Clinical Summary</h4>
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-sm font-medium mb-1">Active Conditions</p>
                                        <div className="flex flex-wrap gap-1">
                                          {selectedPatient.conditions.map((condition, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                              {condition}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <p className="text-sm font-medium mb-1">Allergies</p>
                                        <div className="flex flex-wrap gap-1">
                                          {selectedPatient.allergies.length > 0 ? (
                                            selectedPatient.allergies.map((allergy, idx) => (
                                              <Badge key={idx} variant="destructive" className="text-xs">
                                                {allergy}
                                              </Badge>
                                            ))
                                          ) : (
                                            <span className="text-sm text-muted-foreground">No known allergies</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="vitals" className="mt-4">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
                                      <p className="text-lg font-semibold">{selectedPatient.vitals.bloodPressure}</p>
                                      <p className="text-xs text-muted-foreground">mmHg</p>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <p className="text-xs text-muted-foreground mb-1">Heart Rate</p>
                                      <p className="text-lg font-semibold">{selectedPatient.vitals.heartRate}</p>
                                      <p className="text-xs text-muted-foreground">bpm</p>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                                      <p className="text-lg font-semibold">{selectedPatient.vitals.temperature}°</p>
                                      <p className="text-xs text-muted-foreground">Fahrenheit</p>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <p className="text-xs text-muted-foreground mb-1">Oxygen Sat</p>
                                      <p className="text-lg font-semibold">{selectedPatient.vitals.oxygenSat}%</p>
                                      <p className="text-xs text-muted-foreground">SpO2</p>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <p className="text-xs text-muted-foreground mb-1">Resp Rate</p>
                                      <p className="text-lg font-semibold">{selectedPatient.vitals.respiratoryRate}</p>
                                      <p className="text-xs text-muted-foreground">breaths/min</p>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="medications" className="mt-4">
                                <div className="space-y-3">
                                  {selectedPatient.medications.map((med, idx) => (
                                    <Card key={idx}>
                                      <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <h4 className="font-semibold">{med.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                              {med.dosage} - {med.frequency}
                                            </p>
                                          </div>
                                          <div className="flex gap-2">
                                            <Button size="sm" variant="outline">
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline">
                                              <Pill className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </TabsContent>
                            </Tabs>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {activeView === 'voice' && (
                    <div className="space-y-6">
                      {/* Voice Recording Interface */}
                      <Card className="border-fire-200/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Mic className="h-5 w-5 text-fire-500" />
                            AI Voice Documentation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Recording Controls */}
                          <div className="flex items-center justify-center p-8">
                            <div className="text-center space-y-4">
                              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all ${
                                voiceSession.isRecording 
                                  ? 'bg-red-500 animate-pulse-glow shadow-red-500/50 shadow-lg' 
                                  : 'bg-fire-500 hover:bg-fire-600'
                              }`}>
                                <button
                                  onClick={voiceSession.isRecording ? stopVoiceRecording : startVoiceRecording}
                                  className="w-full h-full rounded-full flex items-center justify-center"
                                >
                                  {voiceSession.isRecording ? (
                                    <MicOff className="h-8 w-8 text-white" />
                                  ) : (
                                    <Mic className="h-8 w-8 text-white" />
                                  )}
                                </button>
                              </div>
                              
                              <div>
                                <p className="text-lg font-semibold">
                                  {voiceSession.isRecording ? 'Recording Active' : 'Ready to Record'}
                                </p>
                                {voiceSession.isRecording && (
                                  <p className="text-sm text-muted-foreground">
                                    Duration: {Math.floor(voiceSession.duration / 60)}:{(voiceSession.duration % 60).toString().padStart(2, '0')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Live Transcript */}
                          {voiceSession.transcript && (
                            <div className="bg-muted/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold">Live Transcript</h4>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                  <span className="text-sm text-green-600">
                                    Confidence: {Math.round(voiceSession.confidence)}%
                                  </span>
                                </div>
                              </div>
                              <div className="bg-background/50 rounded-lg p-3 min-h-[100px]">
                                <p className="text-sm leading-relaxed">
                                  {voiceSession.transcript}
                                  {voiceSession.isRecording && (
                                    <span className="inline-block w-1 h-4 bg-fire-500 ml-1 animate-pulse" />
                                  )}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* AI Suggestions */}
                          <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3">AI Suggestions</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>ICD-10 code J06.9 suggested for upper respiratory symptoms</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Info className="h-4 w-4 text-blue-500" />
                                <span>Consider ordering CBC with differential based on symptoms</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                <span>Patient due for preventive care: mammogram screening</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-3">
                            <Button className="flex-1">
                              <FileText className="h-4 w-4 mr-2" />
                              Generate SOAP Note
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Wand2 className="h-4 w-4 mr-2" />
                              AI Enhancement
                            </Button>
                            <Button variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Recent Voice Notes */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Voice Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              { patient: "Sarah Johnson", timestamp: "2 hours ago", duration: "3:45", status: "processed" },
                              { patient: "Michael Chen", timestamp: "4 hours ago", duration: "5:12", status: "processing" },
                              { patient: "Emma Rodriguez", timestamp: "1 day ago", duration: "2:33", status: "processed" }
                            ].map((note, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-lg bg-fire-100 dark:bg-fire-900/20 flex items-center justify-center">
                                    <Volume2 className="h-5 w-5 text-fire-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{note.patient}</p>
                                    <p className="text-xs text-muted-foreground">{note.timestamp} • {note.duration}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={note.status === 'processed' ? 'default' : 'secondary'}>
                                    {note.status}
                                  </Badge>
                                  <Button size="sm" variant="ghost">
                                    <Play className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeView === 'inbox' && (
                    <div className="space-y-6">
                      {/* Inbox Header */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Messages</h2>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Compose
                          </Button>
                        </div>
                      </div>

                      {/* Message Stats */}
                      <div className="grid grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-red-600">{mockMessages.filter(m => !m.read).length}</p>
                            <p className="text-sm text-muted-foreground">Unread</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-amber-600">{mockMessages.filter(m => m.priority === 'high').length}</p>
                            <p className="text-sm text-muted-foreground">High Priority</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-blue-600">{mockMessages.filter(m => m.type === 'patient').length}</p>
                            <p className="text-sm text-muted-foreground">Patients</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-green-600">{mockMessages.filter(m => m.type === 'lab').length}</p>
                            <p className="text-sm text-muted-foreground">Lab Results</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Message List */}
                      <div className="space-y-2">
                        {mockMessages.map((message) => (
                          <Card key={message.id} className={`cursor-pointer transition-all hover:shadow-md ${!message.read ? 'border-fire-200 bg-fire-50/20 dark:bg-fire-900/10' : ''}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className={`font-medium ${!message.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {message.from}
                                    </p>
                                    <Badge variant="outline" className="text-xs">
                                      {message.type}
                                    </Badge>
                                    {message.priority === 'high' && (
                                      <div className="h-2 w-2 rounded-full bg-red-500" />
                                    )}
                                    {!message.read && (
                                      <div className="h-2 w-2 rounded-full bg-fire-500" />
                                    )}
                                  </div>
                                  <p className={`text-sm mb-1 ${!message.read ? 'font-medium' : 'text-muted-foreground'}`}>
                                    {message.subject}
                                  </p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {message.preview}
                                  </p>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-xs text-muted-foreground">{message.time}</p>
                                  <Button variant="ghost" size="sm" className="mt-2">
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeView === 'analytics' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Analytics & Insights</h2>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export Report
                        </Button>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-green-200/50 bg-green-50/50 dark:bg-green-900/20">
                          <CardContent className="p-6 text-center">
                            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-green-600">+234%</p>
                            <p className="text-sm text-green-700 dark:text-green-400">Documentation Speed</p>
                            <p className="text-xs text-muted-foreground mt-1">vs. traditional methods</p>
                          </CardContent>
                        </Card>

                        <Card className="border-blue-200/50 bg-blue-50/50 dark:bg-blue-900/20">
                          <CardContent className="p-6 text-center">
                            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-blue-600">4.2h</p>
                            <p className="text-sm text-blue-700 dark:text-blue-400">Time Saved Daily</p>
                            <p className="text-xs text-muted-foreground mt-1">per physician</p>
                          </CardContent>
                        </Card>

                        <Card className="border-purple-200/50 bg-purple-50/50 dark:bg-purple-900/20">
                          <CardContent className="p-6 text-center">
                            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-purple-600">98.2%</p>
                            <p className="text-sm text-purple-700 dark:text-purple-400">Clinical Accuracy</p>
                            <p className="text-xs text-muted-foreground mt-1">AI-assisted documentation</p>
                          </CardContent>
                        </Card>

                        <Card className="border-amber-200/50 bg-amber-50/50 dark:bg-amber-900/20">
                          <CardContent className="p-6 text-center">
                            <Heart className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-amber-600">4.8/5</p>
                            <p className="text-sm text-amber-700 dark:text-amber-400">Patient Satisfaction</p>
                            <p className="text-xs text-muted-foreground mt-1">up from 3.2/5</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Efficiency Comparison */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Workflow Efficiency Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Patient Documentation (Before Ignite)</span>
                                <span className="text-red-600">18 minutes</span>
                              </div>
                              <Progress value={90} className="h-3 bg-red-100" />
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Patient Documentation (With Ignite AI)</span>
                                <span className="text-green-600">5.4 minutes</span>
                              </div>
                              <Progress value={27} className="h-3 bg-green-100" />
                            </div>

                            <div className="bg-fire-50/50 dark:bg-fire-900/20 p-4 rounded-lg">
                              <p className="text-sm font-medium text-fire-700 dark:text-fire-400">
                                Time Savings: 12.6 minutes per patient
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                That's 4.2 hours saved daily for a typical practice
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* ROI Metrics */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Return on Investment</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Monthly Software Cost</span>
                                <span className="font-medium">$299/provider</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Time Savings Value</span>
                                <span className="font-medium text-green-600">$2,847/provider</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Increased Patient Volume</span>
                                <span className="font-medium text-green-600">$1,654/provider</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between items-center font-semibold">
                                <span>Net Monthly Benefit</span>
                                <span className="text-green-600">$4,202/provider</span>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                                <p className="text-lg font-bold text-green-600">1,406% ROI</p>
                                <p className="text-xs text-muted-foreground">Return on Investment</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Quality Metrics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Documentation Completeness</span>
                                  <span className="text-green-600">96%</span>
                                </div>
                                <Progress value={96} className="h-2" />
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Coding Accuracy</span>
                                  <span className="text-green-600">94%</span>
                                </div>
                                <Progress value={94} className="h-2" />
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Clinical Decision Support</span>
                                  <span className="text-green-600">89%</span>
                                </div>
                                <Progress value={89} className="h-2" />
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Patient Experience Score</span>
                                  <span className="text-green-600">92%</span>
                                </div>
                                <Progress value={92} className="h-2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {activeView === 'calendar' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Schedule Management</h2>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            View Calendar
                          </Button>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            New Appointment
                          </Button>
                        </div>
                      </div>

                      {/* Schedule Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardContent className="p-6 text-center">
                            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-blue-600">24</p>
                            <p className="text-sm text-blue-700 dark:text-blue-400">Today's Appointments</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-6 text-center">
                            <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-green-600">18 min</p>
                            <p className="text-sm text-green-700 dark:text-green-400">Avg Appointment Time</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-6 text-center">
                            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-purple-600">96%</p>
                            <p className="text-sm text-purple-700 dark:text-purple-400">Attendance Rate</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Today's Appointments */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Today's Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              { time: "9:00 AM", patient: "Sarah Johnson", type: "Annual Physical", duration: "30 min", status: "completed" },
                              { time: "9:30 AM", patient: "Michael Chen", type: "Follow-up", duration: "15 min", status: "completed" },
                              { time: "10:00 AM", patient: "Emma Rodriguez", type: "Prenatal Check", duration: "20 min", status: "in-progress" },
                              { time: "10:30 AM", patient: "James Wilson", type: "Consultation", duration: "45 min", status: "scheduled" },
                              { time: "11:15 AM", patient: "Maria Garcia", type: "Vaccine", duration: "15 min", status: "scheduled" },
                            ].map((apt, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-4">
                                  <div className="text-sm font-medium w-20">{apt.time}</div>
                                  <div>
                                    <p className="font-medium text-sm">{apt.patient}</p>
                                    <p className="text-xs text-muted-foreground">{apt.type} • {apt.duration}</p>
                                  </div>
                                </div>
                                <Badge className={getStatusColor(apt.status)}>
                                  {apt.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Responsive Design Indicator */}
      <div className="mt-6 flex justify-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Monitor className="h-4 w-4" />
          <span>Desktop</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Tablet className="h-4 w-4" />
          <span>Tablet</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Smartphone className="h-4 w-4" />
          <span>Mobile</span>
        </div>
      </div>

      {/* Continue Journey Button */}
      {onContinueJourney && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={onContinueJourney}
            size="lg"
            className="px-8 py-4 bg-gradient-to-r from-fire-500 to-ember-500 hover:from-fire-600 hover:to-ember-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-fire-500/25 transition-all duration-300"
          >
            Continue Your Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
})

export { EHRPreview }