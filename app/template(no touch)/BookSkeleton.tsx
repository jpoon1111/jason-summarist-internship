export default function BookSkeleton() {
  return (
    <div style={{ minWidth: 200, width: 200 }}>
      <div className="skeleton" style={{ width: "100%", height: 172, borderRadius: 4, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 16, width: "80%", borderRadius: 4, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: "60%", borderRadius: 4, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: "90%", borderRadius: 4, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: "50%", borderRadius: 4 }} />
    </div>
  );
}
