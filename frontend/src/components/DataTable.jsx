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

    // Filter states
    const [minLC, setMinLC] = useState('');
    const [minStars, setMinStars] = useState({
        java: '',
        python: '',
        c: '',
        sql: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    const filtered = students.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.roll_number.toLowerCase().includes(search.toLowerCase());

        const matchesLC = minLC === '' || (s.leetcode_solved || 0) >= parseInt(minLC);
        const matchesJava = minStars.java === '' || (s.hr_java_stars || 0) >= parseInt(minStars.java);
        const matchesPython = minStars.python === '' || (s.hr_python_stars || 0) >= parseInt(minStars.python);
        const matchesC = minStars.c === '' || (s.hr_c_stars || 0) >= parseInt(minStars.c);
        const matchesSQL = minStars.sql === '' || (s.hr_sql_stars || 0) >= parseInt(minStars.sql);

        return matchesSearch && matchesLC && matchesJava && matchesPython && matchesC && matchesSQL;
    });

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

    const handleExportFiltered = () => {
        const filters = {
            min_lc: minLC,
            min_java: minStars.java,
            min_python: minStars.python,
            min_c: minStars.c,
            min_sql: minStars.sql
        };
        onExport(filters);
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
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? '❌ Close Filters' : '🔍 Advanced Filters'}
                    </button>
                    <button
                        className="btn btn-accent btn-sm"
                        onClick={handleExportFiltered}
                        disabled={loading || filtered.length === 0}
                    >
                        📥 Export {filtered.length === students.length ? 'All' : 'Filtered'} to Excel
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

            {showFilters && (
                <div className="filter-panel fade-in" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '1rem'
                }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Min. LeetCode</label>
                        <input
                            type="number"
                            className="form-input sm"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            placeholder="0"
                            value={minLC}
                            onChange={(e) => setMinLC(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Min. Java Stars</label>
                        <input
                            type="number"
                            className="form-input sm"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            placeholder="0"
                            value={minStars.java}
                            onChange={(e) => setMinStars({ ...minStars, java: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Min. Python Stars</label>
                        <input
                            type="number"
                            className="form-input sm"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            placeholder="0"
                            value={minStars.python}
                            onChange={(e) => setMinStars({ ...minStars, python: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Min. C Stars</label>
                        <input
                            type="number"
                            className="form-input sm"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            placeholder="0"
                            value={minStars.c}
                            onChange={(e) => setMinStars({ ...minStars, c: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Min. SQL Stars</label>
                        <input
                            type="number"
                            className="form-input sm"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            placeholder="0"
                            value={minStars.sql}
                            onChange={(e) => setMinStars({ ...minStars, sql: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => {
                            setMinLC('');
                            setMinStars({ java: '', python: '', c: '', sql: '' });
                        }}>
                            Reset Filters
                        </button>
                    </div>
                </div>
            )}

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
                                    <td className="lc-cell">
                                        {student.leetcode_solved !== null ? student.leetcode_solved : <span className="text-muted">N/A</span>}
                                    </td>
                                    <td className="hr-cell">
                                        {student.hr_java_stars !== null ? <Stars count={student.hr_java_stars} /> : <span className="text-muted">N/A</span>}
                                    </td>
                                    <td className="hr-cell">
                                        {student.hr_python_stars !== null ? <Stars count={student.hr_python_stars} /> : <span className="text-muted">N/A</span>}
                                    </td>
                                    <td className="hr-cell">
                                        {student.hr_c_stars !== null ? <Stars count={student.hr_c_stars} /> : <span className="text-muted">N/A</span>}
                                    </td>
                                    <td className="hr-cell">
                                        {student.hr_sql_stars !== null ? <Stars count={student.hr_sql_stars} /> : <span className="text-muted">N/A</span>}
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
