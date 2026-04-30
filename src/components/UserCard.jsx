// components/UserCard.jsx
export default function UserCard({ user }) {
    return (
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-sky-500 transition-colors shadow-lg">
            <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
            <p className="text-sky-400 text-sm mb-3">{user.company}</p>
            <div className="text-slate-400 text-sm space-y-1">
                <p>📧 {user.email}</p>
                <p>📞 {user.phone}</p>
            </div>
        </div>
    );
}