 function Header({ data }) {
    return (
        <div className="header">
            <div className="centered-content">
                <br /><br /><br /><br /><br />
                <h1 className="h1 typewriter">{data?.title || "Garden Tips"}</h1>
                 <p className="subtitle-fade">{data?.subtitle || "React JS UI Project"}</p>
            </div>
        </div>
    );
}
export default Header;