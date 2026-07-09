const Profile = ({ name, job = "개발자 "}) => {
    return (
        <div>
            <h3>{name}</h3>
            <p>직업 : {job}</p>
        </div>
    )
}
export default Profile