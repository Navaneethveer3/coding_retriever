import { useState } from 'react';

function Stars({ count, max = 5 }) {
    return (
        <div className="stars">
            {Array.from({ length: max }, (_, i) => (
                <span key={i} className={`star ${i < count ? 'filled' : 'empty'}`}>
                    ★
                </span>
            ))}
        </div>
    );
}

export default function DataTable({ students, onRefreshAll, onRefreshSingle, loading, onExport }) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('roll_number');
    const [sortDir, setSortDir] = useState('asc');

    const filtered = students.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.roll_number.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const sortIcon = (key) => {
        if (sortKey !== key) return '↕';
        return sortDir === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <div className="table-header-left">
                    <h2>Student Data</h2>
                    <span className="table-badge">{filtered.length} students</span>
                </div>
                <div className="table-actions">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search by name or roll no..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={onExport}
                        disabled={loading || students.length === 0}
                    >
                        📥 Export to Excel
                    </button>
                    <button
                        className="btn btn-success btn-sm"
                        onClick={onRefreshAll}
                        disabled={loading}
                    >
                        {loading ? '⏳ Fetching...' : '🔄 Fetch All Data'}
                    </button>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th rowSpan={2} style={{ width: '50px' }}>S.No</th>
                            <th
                                rowSpan={2}
                                onClick={() => handleSort('name')}
                                style={{ cursor: 'pointer' }}
                            >
                                Name {sortIcon('name')}
                            </th>
                            <th
                                rowSpan={2}
                                onClick={() => handleSort('roll_number')}
                                style={{ cursor: 'pointer' }}
                            >
                                Roll Number {sortIcon('roll_number')}
                            </th>
                            <th
                                rowSpan={2}
                                onClick={() => handleSort('leetcode_solved')}
                                style={{ cursor: 'pointer' }}
                            >
                                LeetCode Solved {sortIcon('leetcode_solved')}
                            </th>
                            <th className="hr-group" colSpan={4}>
                                HackerRank Stars
                            </th>
                            <th rowSpan={2} style={{ width: '60px' }}>Action</th>
                        </tr>
                        <tr>
                            <th
                                className="hr-sub"
                                onClick={() => handleSort('hr_java_stars')}
                                style={{ cursor: 'pointer' }}
                            >
                                Java {sortIcon('hr_java_stars')}
                            </th>
                            <th
                                className="hr-sub"
                                onClick={() => handleSort('hr_python_stars')}
                                style={{ cursor: 'pointer' }}
                            >
                                Python {sortIcon('hr_python_stars')}
                            </th>
                            <th
                                className="hr-sub"
                                onClick={() => handleSort('hr_c_stars')}
                                style={{ cursor: 'pointer' }}
                            >
                                C {sortIcon('hr_c_stars')}
                            </th>
                            <th
                                className="hr-sub"
                                onClick={() => handleSort('hr_sql_stars')}
                                style={{ cursor: 'pointer' }}
                            >
                                SQL {sortIcon('hr_sql_stars')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.length === 0 ? (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div className="empty-state">
                                        <div className="empty-state-icon">📭</div>
                                        <h3>No students found</h3>
                                        <p>Upload an Excel file to get started</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            sorted.map((student, index) => (
                                <tr key={student.id}>
                                    <td className="sl-no">{index + 1}</td>
                                    <td className="name-cell">{student.name}</td>
                                    <td>{student.roll_number}</td>
                                    <td className="lc-cell">{student.leetcode_solved}</td>
                                    <td className="hr-cell">
                                        <Stars count={student.hr_java_stars} />
                                    </td>
                                    <td className="hr-cell">
                                        <Stars count={student.hr_python_stars} />
                                    </td>
                                    <td className="hr-cell">
                                        <Stars count={student.hr_c_stars} />
                                    </td>
                                    <td className="hr-cell">
                                        <Stars count={student.hr_sql_stars} />
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => onRefreshSingle(student.id)}
                                            disabled={loading}
                                            title="Refresh this student's data"
                                        >
                                            🔄
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
