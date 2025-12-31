import React from 'react';
import { Link } from 'react-router-dom';

const subjects = [
  'Mathematics',
  'English',
  'Biology',
  'Chemistry',
  'Physics',
  'Social Studies',
  'Geography',
  'History',
  'ICT',
  'French',
  'Literature',
  'Economics',
  'Civic Education',
];
const slug = (s) => s.toLowerCase().replace(/\s+/g, '-');

export default function Radio() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-700 uppercase">Radio</h2>
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {subjects.map((s) => (
            <Link
              key={s}
              to={`/radio/${slug(s)}`}
              className="px-3 py-3 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
