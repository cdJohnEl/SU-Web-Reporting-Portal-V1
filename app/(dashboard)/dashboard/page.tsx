export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-bold text-[#1b5e20]">General Statistics</h2>
        <p className="text-gray-500 text-sm font-medium">Overview of ministry impact and reporting status for 2026</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stat Card 1 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#ffca28] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Schools Reached</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-1">124</div>
          <span className="text-[#1b5e20] text-xs font-semibold bg-[#1b5e20]/10 px-2 py-1 rounded inline-block">+12% from last year</span>
        </div>
        
        {/* Stat Card 2 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#1b5e20] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Decisions</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-1">1,042</div>
          <span className="text-gray-500 text-xs font-medium">Across all zones</span>
        </div>
        
        {/* Stat Card 3 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#1b5e20] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Active Missionaries</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-1">18</div>
          <span className="text-gray-500 text-xs font-medium">Currently on field</span>
        </div>
        
        {/* Stat Card 4 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#0284c7] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Report Progress</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-2">75%</div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-[#0284c7] h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Stat Card 5 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#1b5e20] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Submitted Report</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-1">14</div>
          <span className="text-gray-500 text-xs font-medium">Across all zones</span>
        </div>

        {/* Stat Card 6 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#ffca28] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Pending Reviews</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-1">04</div>
          <span className="text-gray-500 text-xs font-medium">From last quarter</span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        <div className="flex-[2] bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-6 overflow-x-auto">
          <h3 className="text-[#1b5e20] text-lg font-bold border-b border-gray-100 pb-3 mb-4">Recent Submissions</h3>
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr>
                <th className="p-3 bg-[#fffdf7] text-gray-700 font-bold text-sm border-b-2 border-[#1b5e20]/20 rounded-tl-md">Report Type</th>
                <th className="p-3 bg-[#fffdf7] text-gray-700 font-bold text-sm border-b-2 border-[#1b5e20]/20">Zone</th>
                <th className="p-3 bg-[#fffdf7] text-gray-700 font-bold text-sm border-b-2 border-[#1b5e20]/20">Date</th>
                <th className="p-3 bg-[#fffdf7] text-gray-700 font-bold text-sm border-b-2 border-[#1b5e20]/20 rounded-tr-md">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-3 text-sm font-medium text-gray-800">Camping Report</td>
                <td className="p-3 text-sm text-gray-600">Nchia</td>
                <td className="p-3 text-sm text-gray-600">April 12, 2026</td>
                <td className="p-3"><span className="bg-[#1b5e20]/10 text-[#1b5e20] text-xs font-bold px-2.5 py-1 rounded-full">Approved</span></td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-3 text-sm font-medium text-gray-800">Tour Report</td>
                <td className="p-3 text-sm text-gray-600">Gokana</td>
                <td className="p-3 text-sm text-gray-600">April 15, 2026</td>
                <td className="p-3"><span className="bg-[#ffca28]/20 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col gap-3">
          <h3 className="text-[#1b5e20] text-lg font-bold border-b border-gray-100 pb-3 mb-1">Quick Actions</h3>
          <button className="w-full bg-[#1b5e20] hover:bg-[#2e7d32] text-white font-semibold py-2.5 px-4 rounded-md transition-colors shadow-sm text-sm text-left">
            Generate Area Summary
          </button>
          <button className="w-full bg-white hover:bg-gray-50 text-[#1b5e20] border-2 border-[#1b5e20] font-semibold py-2 px-4 rounded-md transition-colors shadow-sm text-sm text-left">
            Export Reading Note Data
          </button>
          <button className="w-full bg-white hover:bg-gray-50 text-[#1b5e20] border-2 border-[#1b5e20] font-semibold py-2 px-4 rounded-md transition-colors shadow-sm text-sm text-left">
            View Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}
