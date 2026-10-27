import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import AnalyticsLayout from './layouts/AnalyticsLayout.jsx'
import AnalyticsOverview from './pages/analytics/AnalyticsOverview.jsx'
import AnalyticsCareer from './pages/analytics/AnalyticsCareer.jsx'
import AnalyticsSkills from './pages/analytics/AnalyticsSkills.jsx'
import AnalyticsAlumni from './pages/analytics/AnalyticsAlumni.jsx'
import AnalyticsOLAP from './pages/analytics/AnalyticsOLAP.jsx'
import AnalyticsMining from './pages/analytics/AnalyticsMining.jsx'
import AnalyticsDataManagement from './pages/analytics/AnalyticsDataManagement.jsx'
import AnalyticsDataDictionary from './pages/analytics/AnalyticsDataDictionary.jsx'
import AnalyticsWarehouseOverview from './pages/analytics/AnalyticsWarehouseOverview.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Support both root navigation and /analytics prefixed navigation */}
          <Route path="/" element={<AnalyticsLayout />}>
            <Route index element={<AnalyticsOverview />} />
            <Route path="overview" element={<AnalyticsOverview />} />
            <Route path="warehouse" element={<AnalyticsWarehouseOverview />} />
            <Route path="schema" element={<AnalyticsWarehouseOverview />} />
            <Route path="career" element={<AnalyticsCareer />} />
            <Route path="skills" element={<AnalyticsSkills />} />
            <Route path="alumni" element={<AnalyticsAlumni />} />
            <Route path="olap" element={<AnalyticsOLAP />} />
            <Route path="mining" element={<AnalyticsMining />} />
            <Route path="datamining" element={<AnalyticsMining />} />
            <Route path="data" element={<AnalyticsDataManagement />} />
            <Route path="dictionary" element={<AnalyticsDataDictionary />} />

            {/* Sub-route aliases for seamless backward compatibility */}
            <Route path="analytics" element={<Navigate to="/" replace />} />
            <Route path="analytics/overview" element={<Navigate to="/overview" replace />} />
            <Route path="analytics/warehouse" element={<Navigate to="/warehouse" replace />} />
            <Route path="analytics/schema" element={<Navigate to="/warehouse" replace />} />
            <Route path="analytics/career" element={<Navigate to="/career" replace />} />
            <Route path="analytics/skills" element={<Navigate to="/skills" replace />} />
            <Route path="analytics/alumni" element={<Navigate to="/alumni" replace />} />
            <Route path="analytics/olap" element={<Navigate to="/olap" replace />} />
            <Route path="analytics/mining" element={<Navigate to="/mining" replace />} />
            <Route path="analytics/datamining" element={<Navigate to="/mining" replace />} />
            <Route path="analytics/data" element={<Navigate to="/data" replace />} />
            <Route path="analytics/dictionary" element={<Navigate to="/dictionary" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
