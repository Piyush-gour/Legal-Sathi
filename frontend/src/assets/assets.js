import add_icon from './add_icon.svg'
import admin_logo from './admin_logo.svg'
import appointment_icon from './appointment_icon.svg'
import cancel_icon from './cancel_icon.svg'
import lawyer_icon from './lawyer_icon.svg'
import home_icon from './home_icon.svg'
import people_icon from './people_icon.svg'
import upload_area from './upload_area.svg'
import list_icon from './list_icon.svg'
import tick_icon from './tick_icon.svg'
import appointments_icon from './appointments_icon.svg'
import earning_icon from './earning_icon.svg'
import patients_icon from './patients_icon.svg'
import logo from './logo.svg'
import profile_pic from './profile_pic.png'
import dropdown_icon from './dropdown_icon.svg'
import group_profiles from './group_profiles.png'
import arrow_icon from './arrow_icon.svg'
import header_img from './header_img.png'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Dermatologist from './Dermatologist.svg'
import Pediatricians from './Pediatricians.svg'
import Neurologist from './Neurologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png' 
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import verified_icon from './verified_icon.svg'
import info_icon from  './info_icon.svg'
import about_image from './about_image.png'
import contact_image from './contact_image.png'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'







import appointment_img from './appointment_img.png'



export const assets = {
    add_icon,
    admin_logo,
    appointment_icon,
    cancel_icon,
    lawyer_icon,
    upload_area,
    home_icon,
    patients_icon,
    people_icon,
    list_icon,
    tick_icon,
    appointments_icon,
    earning_icon,
    logo,
    profile_pic,
    dropdown_icon,
    group_profiles,
    arrow_icon,
    header_img,
    General_physician,
    Gynecologist,
    Dermatologist,
    Pediatricians,
    Neurologist,
    Gastroenterologist,
    appointment_img,
    verified_icon,
    info_icon,
    about_image,
    contact_image,
    menu_icon,
    cross_icon

}

export const practiceAreaData = [
    {
        practiceArea: 'Corporate Law',
        image: General_physician
    },
    {
        practiceArea: 'Criminal Law',
        image: Gynecologist
    },
    {
        practiceArea: 'Family Law',
        image: Dermatologist
    },
    {
        practiceArea: 'Real Estate Law',
        image: Pediatricians
    },
    {
         practiceArea: 'Employment Law',
        image: Neurologist
    },
    {
        practiceArea: 'Immigration Law',
        image: Gastroenterologist
    }
]


export const lawyers = [
  {
    _id: "doc1",
    name: "Advocate Shivali Sharma",
    image: doc1,
    practiceArea: "Civil Law",
    degree: "LLB",
    experience: "8 Years",
    about: "Specializes in Civil law, High Court matters, and Family law with extensive experience in handling complex legal disputes in Bhopal.",
    fees: 800,
    address: {
      line1: "High Court Complex",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.8,
    reviews: 156
  },
  {
    _id: "doc2",
    name: "Advocate Ashok Gupta",
    image: doc2,
    practiceArea: "Civil Law",
    degree: "LLB, LLM",
    experience: "12 Years",
    about: "Expert in Civil litigation and Property law matters with a strong track record in property disputes and civil cases.",
    fees: 700,
    address: {
      line1: "Civil Court Area",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.7,
    reviews: 142
  },
  {
    _id: "doc3",
    name: "Adv. Harsh Dubey",
    image: doc3,
    practiceArea: "Corporate Law",
    degree: "LLB, LLM",
    experience: "6 Years",
    about: "Experienced in Civil and Corporate law with expertise in business litigation and corporate compliance matters.",
    fees: 900,
    address: {
      line1: "Business District",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.6,
    reviews: 98
  },
  {
    _id: "doc4",
    name: "Kaivalya Ratnaparkhe",
    image: doc4,
    practiceArea: "Criminal Law",
    degree: "LLB",
    experience: "7 Years",
    about: "Specializes in Criminal and Civil law with comprehensive legal solutions for criminal defense and civil matters.",
    fees: 750,
    address: {
      line1: "Court Complex",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.5,
    reviews: 128
  },
  {
    _id: "doc5",
    name: "Pankaj Pande",
    image: doc5,
    practiceArea: "Family Law",
    degree: "LLB",
    experience: "9 Years",
    about: "Expert in Family law and Property matters with compassionate approach to family disputes and property transactions.",
    fees: 650,
    address: {
      line1: "Family Court Area",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.7,
    reviews: 167
  },
  {
    _id: "doc6",
    name: "Ravi Panth",
    image: doc6,
    practiceArea: "Criminal Law",
    degree: "LLB",
    experience: "10 Years",
    about: "Criminal defence specialist with Panth Law Chamber, focusing on bail applications and criminal defense cases.",
    fees: 800,
    address: {
      line1: "Panth Law Chamber",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.8,
    reviews: 189
  },
  {
    _id: "doc7",
    name: "Advocate S.K. Prajapati",
    image: doc7,
    practiceArea: "Real Estate Law",
    degree: "LLB, LLM",
    experience: "15 Years",
    about: "Senior advocate specializing in Property, Family, and Civil law with extensive experience in real estate transactions.",
    fees: 900,
    address: {
      line1: "High Court Complex",
      line2: "Indore, Madhya Pradesh"
    },
    rating: 4.9,
    reviews: 245
  },
  {
    _id: "doc8",
    name: "Advocate Arpan Jain",
    image: doc8,
    practiceArea: "Family Law",
    degree: "LLB",
    experience: "8 Years",
    about: "Family law expert handling Family, Criminal, and Property matters with personalized legal guidance.",
    fees: 700,
    address: {
      line1: "Civil Court Complex",
      line2: "Indore, Madhya Pradesh"
    },
    rating: 4.6,
    reviews: 134
  },
  {
    _id: "doc9",
    name: "Adv. Sunil Kumar Sharma",
    image: doc9,
    practiceArea: "Civil Law",
    degree: "LLB",
    experience: "11 Years",
    about: "Experienced advocate in Civil and Criminal law with strong litigation skills and courtroom expertise.",
    fees: 750,
    address: {
      line1: "District Court",
      line2: "Indore, Madhya Pradesh"
    },
    rating: 4.7,
    reviews: 156
  },
  {
    _id: "doc10",
    name: "Mukund Choudhary",
    image: doc10,
    practiceArea: "Real Estate Law",
    degree: "LLB",
    experience: "6 Years",
    about: "Property and Criminal law specialist with expertise in property disputes and criminal defense matters.",
    fees: 650,
    address: {
      line1: "Property Court Area",
      line2: "Indore, Madhya Pradesh"
    },
    rating: 4.5,
    reviews: 112
  },
  {
    _id: "doc11",
    name: "Adv. Bhavdeep Singh",
    image: doc11,
    practiceArea: "Corporate Law",
    degree: "LLB, LLM",
    experience: "9 Years",
    about: "Corporate law expert handling Criminal, Civil, and Corporate matters with comprehensive business legal solutions.",
    fees: 850,
    address: {
      line1: "Business District",
      line2: "Indore, Madhya Pradesh"
    },
    rating: 4.8,
    reviews: 178
  },
  {
    _id: "doc12",
    name: "Adv. Virat Shrivastava",
    image: doc12,
    practiceArea: "Civil Law",
    degree: "LLB",
    experience: "5 Years",
    about: "Civil and Family law practitioner with focus on civil litigation and family dispute resolution.",
    fees: 600,
    address: {
      line1: "Civil Court",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.4,
    reviews: 87
  },
  {
    _id: "doc13",
    name: "Advocate Anuradha Vasisht",
    image: doc13,
    practiceArea: "Family Law",
    degree: "LLB",
    experience: "7 Years",
    about: "Family and Civil law specialist with compassionate approach to family matters and civil disputes.",
    fees: 700,
    address: {
      line1: "Family Court",
      line2: "Jabalpur, Madhya Pradesh"
    },
    rating: 4.6,
    reviews: 143
  },
  {
    _id: "doc14",
    name: "Advocate Pradeep Kumar",
    image: doc14,
    practiceArea: "Civil Law",
    degree: "LLB, LLM",
    experience: "12 Years",
    about: "Civil litigation expert with extensive experience in complex civil cases and legal disputes.",
    fees: 800,
    address: {
      line1: "High Court Complex",
      line2: "Jabalpur, Madhya Pradesh"
    },
    rating: 4.7,
    reviews: 201
  },
  {
    _id: "doc15",
    name: "Adv. Kaushal",
    image: doc15,
    practiceArea: "Criminal Law",
    degree: "LLB",
    experience: "10 Years",
    about: "Criminal and Civil law practitioner with Kaushal Associates, specializing in criminal defense and civil matters.",
    fees: 750,
    address: {
      line1: "Kaushal Associates",
      line2: "Gwalior, Madhya Pradesh"
    },
    rating: 4.8,
    reviews: 167
  },
  {
    _id: "doc16",
    name: "Advocate Anshu Gupta",
    image: doc1,
    practiceArea: "Real Estate Law",
    degree: "LLB",
    experience: "8 Years",
    about: "Property and Civil law expert with Krishna Law Chamber, handling property transactions and civil litigation.",
    fees: 700,
    address: {
      line1: "Krishna Law Chamber",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.5,
    reviews: 134
  },
  {
    _id: "doc17",
    name: "Adv. Mohd Zafar Raja",
    image: doc2,
    practiceArea: "Criminal Law",
    degree: "LLB",
    experience: "9 Years",
    about: "Criminal and Civil law specialist with strong expertise in criminal defense and civil litigation matters.",
    fees: 750,
    address: {
      line1: "Criminal Court Complex",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.6,
    reviews: 156
  },
  {
    _id: "doc18",
    name: "Adv. Abhishek Mehra",
    image: doc3,
    practiceArea: "Real Estate Law",
    degree: "LLB",
    experience: "6 Years",
    about: "Property and Family law practitioner with expertise in property disputes and family legal matters.",
    fees: 650,
    address: {
      line1: "Property Legal Center",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.4,
    reviews: 98
  },
  {
    _id: "doc19",
    name: "Adv. Raksha Shrivastava",
    image: doc4,
    practiceArea: "Family Law",
    degree: "LLB",
    experience: "7 Years",
    about: "Family law and Matrimonial specialist with compassionate approach to family disputes and matrimonial cases.",
    fees: 600,
    address: {
      line1: "Family Legal Center",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.7,
    reviews: 123
  },
  {
    _id: "doc20",
    name: "Advocate Akshay Aamly",
    image: doc5,
    practiceArea: "Corporate Law",
    degree: "LLB, LLM",
    experience: "5 Years",
    about: "Civil and Corporate law expert with focus on business litigation and corporate compliance matters.",
    fees: 800,
    address: {
      line1: "Corporate Legal Center",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.5,
    reviews: 89
  },
  {
    _id: "doc21",
    name: "Advocate Sameer Seth",
    image: doc6,
    practiceArea: "Criminal Law",
    degree: "LLB",
    experience: "8 Years",
    about: "Civil and Criminal law practitioner with comprehensive legal solutions for civil and criminal matters.",
    fees: 700,
    address: {
      line1: "District Court",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.6,
    reviews: 145
  },
  {
    _id: "doc22",
    name: "Advocate J S Rohilla",
    image: doc7,
    practiceArea: "Civil Law",
    degree: "LLB",
    experience: "11 Years",
    about: "Civil and Criminal law expert serving Indore and surrounding districts with extensive litigation experience.",
    fees: 750,
    address: {
      line1: "District Legal Center",
      line2: "Indore, Madhya Pradesh"
    },
    rating: 4.7,
    reviews: 178
  },
  {
    _id: "doc23",
    name: "Adv. Rahul Kabra",
    image: doc8,
    practiceArea: "Criminal Law",
    degree: "LLB",
    experience: "9 Years",
    about: "Criminal and Civil law specialist serving Chhindwara and Indore region with strong criminal defense expertise.",
    fees: 700,
    address: {
      line1: "Regional Court Complex",
      line2: "Chhindwara, Madhya Pradesh"
    },
    rating: 4.6,
    reviews: 134
  },
  {
    _id: "doc24",
    name: "Advocate Priya Sharma",
    image: doc1,
    practiceArea: "Employment Law",
    degree: "LLB, LLM (Labour Law)",
    experience: "10 Years",
    about: "Employment law specialist with expertise in workplace disputes, wrongful termination, labor compliance, and employee rights protection.",
    fees: 850,
    address: {
      line1: "Employment Law Center",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.8,
    reviews: 192
  },
  {
    _id: "doc25",
    name: "Adv. Rajesh Kumar",
    image: doc2,
    practiceArea: "Employment Law",
    degree: "LLB, MBA (HR)",
    experience: "12 Years",
    about: "Labor law expert specializing in employment contracts, workplace harassment, industrial disputes, and HR legal compliance.",
    fees: 900,
    address: {
      line1: "Labor Court Complex",
      line2: "Indore, Madhya Pradesh"
    },
    rating: 4.7,
    reviews: 218
  },
  {
    _id: "doc26",
    name: "Advocate Meera Patel",
    image: doc4,
    practiceArea: "Employment Law",
    degree: "LLB, LLM",
    experience: "8 Years",
    about: "Employment rights advocate focusing on gender discrimination, maternity benefits, wage disputes, and workplace safety issues.",
    fees: 750,
    address: {
      line1: "Women's Legal Aid Center",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.9,
    reviews: 165
  },
  {
    _id: "doc27",
    name: "Adv. Vikram Singh",
    image: doc3,
    practiceArea: "Immigration Law",
    degree: "LLB, LLM (International Law)",
    experience: "15 Years",
    about: "Immigration law specialist with extensive experience in visa applications, citizenship matters, deportation defense, and asylum cases.",
    fees: 1200,
    address: {
      line1: "International Law Chambers",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.9,
    reviews: 287
  },
  {
    _id: "doc28",
    name: "Advocate Sunita Agarwal",
    image: doc1,
    practiceArea: "Immigration Law",
    degree: "LLB, LLM",
    experience: "11 Years",
    about: "Immigration attorney specializing in family reunification, work permits, student visas, and permanent residency applications.",
    fees: 1000,
    address: {
      line1: "Immigration Legal Services",
      line2: "Indore, Madhya Pradesh"
    },
    rating: 4.8,
    reviews: 234
  },
  {
    _id: "doc29",
    name: "Adv. Arjun Malhotra",
    image: doc2,
    practiceArea: "Immigration Law",
    degree: "LLB, Diploma in Immigration Law",
    experience: "9 Years",
    about: "Immigration law practitioner with expertise in business immigration, investor visas, and immigration appeals and litigation.",
    fees: 950,
    address: {
      line1: "Global Immigration Center",
      line2: "Bhopal, Madhya Pradesh"
    },
    rating: 4.7,
    reviews: 198
  },
  {
    _id: "doc30",
    name: "Advocate Kavita Joshi",
    image: doc4,
    practiceArea: "Employment Law",
    degree: "LLB, PG Diploma in Labor Law",
    experience: "7 Years",
    about: "Employment law counsel specializing in contract negotiations, severance agreements, non-compete clauses, and employment litigation.",
    fees: 700,
    address: {
      line1: "Employment Legal Center",
      line2: "Jabalpur, Madhya Pradesh"
    },
    rating: 4.6,
    reviews: 143
  },
  {
    _id: "doc31",
    name: "Adv. Rohit Verma",
    image: doc3,
    practiceArea: "Immigration Law",
    degree: "LLB, LLM (International Law)",
    experience: "13 Years",
    about: "Immigration law expert handling complex deportation cases, citizenship applications, and immigration court proceedings.",
    fees: 1100,
    address: {
      line1: "Verma Immigration Law Firm",
      line2: "Indore, Madhya Pradesh"
    },
    rating: 4.8,
    reviews: 256
  }
];
