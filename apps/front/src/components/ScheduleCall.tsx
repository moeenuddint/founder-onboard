'use client'

import { Calendar, Clock, Users, Video } from 'lucide-react'

export default function ScheduleCall() {
  const handleScheduleClick = () => {
    window.open('https://cal.com/founder-onboard', '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Schedule a Call</h2>
              <p className="text-blue-100">Book a meeting with our investment team</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Call Information */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What to expect:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Investment Discussion</p>
                      <p className="text-sm text-gray-600">Review your business model and growth plans</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Investment Readiness</p>
                      <p className="text-sm text-gray-600">Assess your current fundraising position</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Video className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Next Steps</p>
                      <p className="text-sm text-gray-600">Get personalized recommendations and action items</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Call Details:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Duration: 30-45 minutes</li>
                  <li>• Format: Video call via Zoom/Google Meet</li>
                  <li>• Attendees: You + 1-2 investment team members</li>
                  <li>• Preparation: Review your uploaded documents beforehand</li>
                </ul>
              </div>
            </div>

            {/* Scheduling Action */}
            <div className="flex flex-col justify-center">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Schedule?</h3>
                <p className="text-gray-600 mb-6">Choose a convenient time that works for you</p>
                
                <button
                  onClick={handleScheduleClick}
                  className="w-full bg-blue-600 text-white py-4 px-8 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  View Available Times
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>You'll receive a calendar invite with the meeting link</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}