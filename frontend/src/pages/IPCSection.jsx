import React, { useState } from 'react';

const IPCSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);

  const ipcSections = [
    {
      section: "302",
      title: "Murder",
      description: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
      punishment: "Death or Life imprisonment + Fine",
      category: "Offences against Human Body"
    },
    {
      section: "420",
      title: "Cheating and dishonestly inducing delivery of property",
      description: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
      punishment: "Imprisonment up to 7 years + Fine",
      category: "Offences relating to Property"
    },
    {
      section: "498A",
      title: "Husband or relative of husband of a woman subjecting her to cruelty",
      description: "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.",
      punishment: "Imprisonment up to 3 years + Fine",
      category: "Offences against Women"
    },
    {
      section: "376",
      title: "Rape",
      description: "Whoever commits rape shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.",
      punishment: "Rigorous imprisonment 10 years to life + Fine",
      category: "Offences against Women"
    },
    {
      section: "379",
      title: "Theft",
      description: "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
      punishment: "Imprisonment up to 3 years or Fine or Both",
      category: "Offences relating to Property"
    },
    {
      section: "304",
      title: "Culpable homicide not amounting to murder",
      description: "Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine, if the act by which the death is caused is done with the intention of causing death, or of causing such bodily injury as is likely to cause death.",
      punishment: "Life imprisonment or up to 10 years + Fine",
      category: "Offences against Human Body"
    },
    {
      section: "354",
      title: "Assault or criminal force to woman with intent to outrage her modesty",
      description: "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which shall not be less than one year but which may extend to five years, and shall also be liable to fine.",
      punishment: "Imprisonment 1-5 years + Fine",
      category: "Offences against Women"
    },
    {
      section: "323",
      title: "Voluntarily causing hurt",
      description: "Whoever, except in the case provided for by section 334, voluntarily causes hurt, shall be punished with imprisonment of either description for a term which may extend to one year, or with fine which may extend to one thousand rupees, or with both.",
      punishment: "Imprisonment up to 1 year or Fine up to ₹1000 or Both",
      category: "Offences against Human Body"
    }
  ];

  const filteredSections = ipcSections.filter(section =>
    section.section.includes(searchTerm) ||
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Indian Penal Code (IPC) Sections</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search and explore various sections of the Indian Penal Code. 
            Get detailed information about offences and their punishments.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search IPC sections, titles, or descriptions..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* IPC Sections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedSection(section)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Section {section.section}
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {section.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {section.description.substring(0, 120)}...
              </p>
              <div className="border-t pt-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Punishment:</span> {section.punishment}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredSections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No IPC sections found matching your search.</p>
          </div>
        )}

        {/* Modal for detailed view */}
        {selectedSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    IPC Section {selectedSection.section}
                  </h2>
                  <button
                    onClick={() => setSelectedSection(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedSection.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedSection.title}
                </h3>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Description:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedSection.description}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Punishment:</h4>
                  <p className="text-red-800">{selectedSection.punishment}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPCSection;
