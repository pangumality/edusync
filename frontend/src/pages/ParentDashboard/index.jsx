import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  User
} from 'lucide-react';
import clsx from 'clsx';

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childData, setChildData] = useState({
    overview: null,
    attendance: null,
    results: null,
    fees: null
  });
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildDetails(selectedChild.id);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const response = await api.get('/parents/children');
      setChildren(response.data);
      if (response.data.length > 0) {
        setSelectedChild(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildDetails = async (studentId) => {
    setLoadingDetails(true);
    try {
      const [overviewRes, attendanceRes, resultsRes, feesRes] = await Promise.all([
        api.get(`/parents/children/${studentId}/overview`),
        api.get(`/parents/children/${studentId}/attendance`),
        api.get(`/parents/children/${studentId}/results`),
        api.get(`/parents/children/${studentId}/fees`)
      ]);

      setChildData({
        overview: overviewRes.data,
        attendance: attendanceRes.data,
        results: resultsRes.data,
        fees: feesRes.data
      });
    } catch (error) {
      console.error('Error fetching child details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Users size={48} className="mb-4" />
        <h2 className="text-xl font-semibold">No Children Linked</h2>
        <p>There are no students linked to your parent account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Child Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Parent Portal</h1>
          <p className="text-gray-500">Monitor your child's progress</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {children.map(child => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors whitespace-nowrap",
                selectedChild?.id === child.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              )}
            >
              <User size={18} />
              <span className="font-medium">{child.name}</span>
              <span className="text-xs opacity-80">({child.class})</span>
            </button>
          ))}
        </div>
      </div>

      {loadingDetails ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Academic Overview Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-blue-500" size={20} />
                Academic Overview
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500">Class Teacher</span>
                <span className="font-medium">{childData.overview?.classTeacher?.user?.firstName || 'Not Assigned'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500">Total Subjects</span>
                <span className="font-medium">{childData.overview?.subjects?.length || 0}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Enrolled Subjects:</p>
                <div className="flex flex-wrap gap-2">
                  {childData.overview?.subjects?.map(sub => (
                    <span key={sub.id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                      {sub.name}
                    </span>
                  )) || <span className="text-gray-400 text-sm">No subjects enrolled</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="text-green-500" size={20} />
                Attendance
              </h3>
              <span className={clsx(
                "px-2 py-1 rounded-full text-xs font-bold",
                (childData.attendance?.percentage || 0) >= 75 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {childData.attendance?.percentage?.toFixed(1) || 0}%
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-lg font-bold text-gray-800">{childData.attendance?.summary?.present || 0}</div>
                  <div className="text-xs text-gray-500">Present</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-lg font-bold text-gray-800">{childData.attendance?.summary?.absent || 0}</div>
                  <div className="text-xs text-gray-500">Absent</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-lg font-bold text-gray-800">{childData.attendance?.summary?.late || 0}</div>
                  <div className="text-xs text-gray-500">Late</div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-400">Recent History:</p>
                {childData.attendance?.recent?.slice(0, 3).map((record, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{new Date(record.date).toLocaleDateString()}</span>
                    <span className={clsx(
                      "text-xs px-2 py-0.5 rounded",
                      record.status === 'present' ? "bg-green-100 text-green-700" :
                      record.status === 'absent' ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    )}>
                      {record.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fees Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <CreditCard className="text-purple-500" size={20} />
                Fees Status
              </h3>
              {childData.fees?.outstanding > 0 ? (
                <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                  <AlertCircle size={14} /> Due
                </span>
              ) : (
                <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                  <CheckCircle size={14} /> Paid
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg flex justify-between items-center">
                <span className="text-purple-700 font-medium">Outstanding</span>
                <span className="text-2xl font-bold text-purple-800">
                  ${childData.fees?.outstanding?.toLocaleString() || 0}
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Recent Transactions:</p>
                {childData.fees?.history?.length > 0 ? (
                  childData.fees.history.slice(0, 3).map((tx, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div>
                        <div className="font-medium text-gray-700">{tx.description || 'Fee Payment'}</div>
                        <div className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</div>
                      </div>
                      <span className="font-medium text-gray-800">${tx.amount}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No recent transactions</p>
                )}
              </div>
            </div>
          </div>

          {/* Results Card - Spans full width on mobile, 2 cols on large screens */}
          <div className="md:col-span-2 lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Award className="text-orange-500" size={20} />
                Recent Results
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            
            {childData.results?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-2 rounded-l-lg">Exam</th>
                      <th className="px-4 py-2">Subject</th>
                      <th className="px-4 py-2">Score</th>
                      <th className="px-4 py-2">Grade</th>
                      <th className="px-4 py-2 rounded-r-lg">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {childData.results.map((result, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{result.examName}</td>
                        <td className="px-4 py-3">{result.subjectName}</td>
                        <td className="px-4 py-3 font-semibold text-gray-700">
                          {result.marksObtained}/{result.totalMarks}
                        </td>
                        <td className="px-4 py-3">
                          <span className={clsx(
                            "px-2 py-1 rounded text-xs font-medium",
                            result.grade === 'A' ? "bg-green-100 text-green-700" :
                            result.grade === 'B' ? "bg-blue-100 text-blue-700" :
                            result.grade === 'C' ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {result.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{new Date(result.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <TrendingUp size={32} className="mx-auto mb-2 opacity-50" />
                <p>No exam results available yet.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
