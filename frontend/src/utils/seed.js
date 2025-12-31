export function seedClasses() {
  const classes = [
    { id: 'class-1', name: 'Grade 1', sections: ['A', 'B'] },
    { id: 'class-2', name: 'Grade 2', sections: ['A', 'B'] },
    { id: 'class-3', name: 'Grade 3', sections: ['A', 'B', 'C'] },
    { id: 'class-4', name: 'Grade 4', sections: ['A', 'B'] },
    { id: 'class-5', name: 'Grade 5', sections: ['A'] },
    { id: 'class-6', name: 'Grade 6', sections: ['A', 'B'] },
  ];
  localStorage.setItem('classes:doonites', JSON.stringify(classes));
  return classes;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function seedTeachers() {
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'ICT', 'French'];
  const names = [
    'Alice Johnson','Bernard Mensah','Chandra Patel','Daisy Moyo','Emeka Nwosu','Fatima Bello',
    'George Tetteh','Hannah Abebe','Ibrahim Sule','Jane Doe','Kwame Darko','Lilian Owusu',
    'Maryam Ali','Nana Boateng','Olu Adebayo','Peter Kim','Queen Akosua','Rahul Singh',
    'Sarah Kofi','Thomas Nkrumah'
  ];
  const list = names.map((n, i) => ({
    id: uid(),
    name: n,
    email: `${n.split(' ')[0].toLowerCase()}@doonites.com`,
    subject: subjects[i % subjects.length],
  }));
  localStorage.setItem('teachers:doonites', JSON.stringify(list));
  return list;
}

export function seedStudents(classes) {
  const first = ['Amina','Daniel','Grace','Sam','Rahul','Yara','Chen','Maryam','Peter','Olivia','Kwame','Lara','Victor','Noah','Maya','Ivy','Jason','Kofi','Ama','Zara'];
  const last = ['Kora','Mensah','Okoro','Ndlovu','Patel','Hassan','Li','Ali','Kim','Adebayo','Darko','Owusu','Tetteh','Bello','Nwosu','Moyo','Doe','Boateng','Abebe','Sule'];
  const list = [];
  const cls = classes || JSON.parse(localStorage.getItem('classes:doonites') || '[]');
  let idx = 0;
  for (const c of cls) {
    for (const sec of c.sections) {
      for (let i = 0; i < 6; i++) {
        const name = `${first[idx % first.length]} ${last[(idx + i) % last.length]}`;
        list.push({
          id: uid(),
          name,
          email: `${name.split(' ')[0].toLowerCase()}@school.local`,
          klass: c.id,
          section: sec,
        });
        idx++;
      }
    }
  }
  localStorage.setItem('students:doonites', JSON.stringify(list));
  return list;
}

export function seedAll() {
  const classes = seedClasses();
  seedTeachers();
  seedStudents(classes);
}
