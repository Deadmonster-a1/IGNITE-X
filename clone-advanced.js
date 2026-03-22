const fs = require('fs');
const path = require('path');

function cloneDir(src, dest, stringMap) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    
    fs.readdirSync(src).forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.lstatSync(srcPath).isDirectory()) {
            cloneDir(srcPath, destPath, stringMap);
        } else {
            let content = fs.readFileSync(srcPath, 'utf8');
            for (const [key, val] of Object.entries(stringMap)) {
                content = content.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), val);
            }
            fs.writeFileSync(destPath, content);
            console.log('Cloned', destPath);
        }
    });
}

cloneDir(
    'p:/START UP/b_lzmLbZRuAmE-1772444900141/app/programs/dsa-intermediate',
    'p:/START UP/b_lzmLbZRuAmE-1772444900141/app/programs/dsa-advanced',
    {
        'dsa-intermediate-course-data': 'dsa-advanced-course-data',
        '/programs/dsa-intermediate': '/programs/dsa-advanced',
        'DSAIntermediateCourseDocsLayout': 'DSAAdvancedCourseDocsLayout',
        'DSAIntermediateLandingPage': 'DSAAdvancedLandingPage',
        'DSA Intermediate: Core Data Structures': 'DSA Advanced: Algorithmic Paradigms'
    }
);
