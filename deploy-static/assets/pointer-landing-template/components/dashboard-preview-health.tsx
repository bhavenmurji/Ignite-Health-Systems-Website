"use client"

import { useState } from "react"
import { Check, Clock, Activity, Users, FileText, Shield } from "lucide-react"

export function DashboardPreviewHealth() {
  const [activeTab, setActiveTab] = useState("patient")

  return (
    <div className="w-full max-w-[1200px] mx-auto px-5">
      <div className="rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Ignite Health Portal</h3>
                <p className="text-xs text-muted-foreground">Dr. Sarah Johnson - Family Medicine</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-full bg-green-500/20 flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-500">Live</span>
              </div>
              <div className="px-2 py-1 rounded-full bg-primary/20">
                <span className="text-xs text-primary font-medium">HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-background/95 backdrop-blur-sm border-b border-white/10 px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("patient")}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === "patient"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-sm font-medium">Patient Encounter</span>
            </button>
            <button
              onClick={() => setActiveTab("voice")}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === "voice"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-sm font-medium">Voice Transcription</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === "analytics"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-sm font-medium">Analytics</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-background/95 backdrop-blur-sm p-6">
          {activeTab === "patient" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-foreground">Current Patient</h4>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Started 2 min ago</span>
                </div>
              </div>
              
              <div className="bg-card/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">John Smith</p>
                    <p className="text-sm text-muted-foreground">DOB: 05/15/1985 • MRN: 123456</p>
                  </div>
                  <div className="px-2 py-1 bg-primary/20 rounded-full">
                    <span className="text-xs text-primary">Follow-up Visit</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-white/10">
                  <p className="text-sm font-medium text-foreground mb-2">Chief Complaint</p>
                  <p className="text-sm text-muted-foreground">
                    Hypertension follow-up, medication review
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <p className="text-sm font-medium text-foreground mb-2">AI-Generated SOAP Note</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">S:</span> Patient reports good medication compliance...
                    </div>
                    <div>
                      <span className="font-medium text-foreground">O:</span> BP 128/82, HR 72, improved from last visit...
                    </div>
                    <div>
                      <span className="font-medium text-foreground">A:</span> Hypertension, improving with current regimen...
                    </div>
                    <div>
                      <span className="font-medium text-foreground">P:</span> Continue current medications, follow-up in 3 months...
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button className="flex-1 py-2 px-3 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                    Generate ICD-10
                  </button>
                  <button className="flex-1 py-2 px-3 bg-secondary/20 text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/30 transition-colors">
                    Complete Note
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "voice" && (
            <div className="space-y-4">
              <div className="bg-card/50 rounded-lg p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/40 flex items-center justify-center animate-pulse">
                    <div className="w-6 h-6 rounded-full bg-primary" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">Voice Recording Active</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Speak naturally - AI is transcribing in real-time
                </p>
                <div className="bg-background/50 rounded-lg p-3 text-left">
                  <p className="text-sm text-muted-foreground">
                    "Patient presents today for follow-up of hypertension. Reports taking medications as prescribed. 
                    No side effects noted. Blood pressure has been stable at home..."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Today's Patients</span>
                </div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-green-500">+20% from average</p>
              </div>
              
              <div className="bg-card/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Notes Completed</span>
                </div>
                <p className="text-2xl font-bold text-foreground">11</p>
                <p className="text-xs text-muted-foreground">92% completion rate</p>
              </div>
              
              <div className="bg-card/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Time Saved</span>
                </div>
                <p className="text-2xl font-bold text-foreground">3.5h</p>
                <p className="text-xs text-green-500">+45 min vs manual</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}