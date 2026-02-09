import { Info, Target, Eye } from 'lucide-react';

function About({ data }) {
    return (
        <div className="about">
            <div className="centered-content">
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Info size={28} />
                    {data?.title || "About GARDEN TSS"}
                </h3>
                <p>{data?.description}</p>
                <div className="extra-content">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Target size={20} /> Our Mission
                    </h4>
                    <p>To provide high-quality technical and vocational education that equips students with practical skills and ethical values.</p>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Eye size={20} /> Our Vision
                    </h4>
                    <p>To be a center of excellence in technical education, producing innovative leaders who contribute to national development.</p>
                </div>
            </div>
        </div>
    );
}

export default About;
