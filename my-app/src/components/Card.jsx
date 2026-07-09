const Card = ({ title, desc, emoji }) => {
    return (
        <div className="card">
            <span>{emoji}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    )
}
export default Card