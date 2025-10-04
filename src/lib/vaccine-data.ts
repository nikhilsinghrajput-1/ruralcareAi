export type Vaccine = {
  id: string;
  name: string;
  disease: string;
  age: string;
  description: string;
};

export const VACCINE_SCHEDULE: Vaccine[] = [
  {
    id: 'bcg',
    name: 'BCG (Bacillus Calmette-Guérin)',
    disease: 'Tuberculosis (severe forms in children)',
    age: 'At birth',
    description: 'A single dose given to infants soon after birth to protect against severe forms of tuberculosis like TB meningitis.',
  },
  {
    id: 'hep-b-birth',
    name: 'Hepatitis B (Birth Dose)',
    disease: 'Hepatitis B',
    age: 'At birth',
    description: 'The first dose of the Hepatitis B vaccine, given within 24 hours of birth to prevent mother-to-child transmission.',
  },
  {
    id: 'opv-0',
    name: 'Oral Polio Vaccine (OPV) - 0 Dose',
    disease: 'Poliomyelitis',
    age: 'At birth',
    description: 'A birth dose of OPV to provide early immunity against the poliovirus.',
  },
  {
    id: 'dpt-1',
    name: 'DTP - 1st Dose',
    disease: 'Diphtheria, Tetanus, Pertussis (Whooping Cough)',
    age: '6 weeks',
    description: 'First dose of the combination vaccine that protects against three serious bacterial diseases.',
  },
   {
    id: 'opv-1',
    name: 'OPV - 1st Dose',
    disease: 'Poliomyelitis',
    age: '6 weeks',
    description: 'First of the primary series of Oral Polio Vaccine doses.',
  },
  {
    id: 'pcv-1',
    name: 'PCV - 1st Dose',
    disease: 'Pneumococcal Disease (Pneumonia, Meningitis)',
    age: '6 weeks',
    description: 'First dose of the pneumococcal conjugate vaccine to protect against diseases caused by Streptococcus pneumoniae.',
  },
  {
    id: 'dpt-2',
    name: 'DTP - 2nd Dose',
    disease: 'Diphtheria, Tetanus, Pertussis',
    age: '10 weeks',
    description: 'Second dose of the DTP combination vaccine.',
  },
  {
    id: 'opv-2',
    name: 'OPV - 2nd Dose',
    disease: 'Poliomyelitis',
    age: '10 weeks',
    description: 'Second dose in the primary series of Oral Polio Vaccine.',
  },
  {
    id: 'dpt-3',
    name: 'DTP - 3rd Dose',
    disease: 'Diphtheria, Tetanus, Pertussis',
    age: '14 weeks',
    description: 'Third dose of the DTP combination vaccine to complete the primary series.',
  },
    {
    id: 'opv-3',
    name: 'OPV - 3rd Dose',
    disease: 'Poliomyelitis',
    age: '14 weeks',
    description: 'Third dose in the primary OPV series, crucial for strong immunity.',
  },
  {
    id: 'pcv-booster',
    name: 'PCV - Booster Dose',
    disease: 'Pneumococcal Disease',
    age: '9-12 months',
    description: 'A booster dose of the pneumococcal vaccine to ensure long-term protection.',
  },
  {
    id: 'mmr-1',
    name: 'MMR - 1st Dose',
    disease: 'Measles, Mumps, Rubella',
    age: '9-12 months',
    description: 'First dose of the vaccine protecting against three common childhood viral diseases.',
  },
  {
    id: 'dpt-booster-1',
    name: 'DTP - 1st Booster',
    disease: 'Diphtheria, Tetanus, Pertussis',
    age: '16-24 months',
    description: 'First booster dose after the primary series to maintain immunity levels.',
  },
  {
    id: 'mmr-2',
    name: 'MMR - 2nd Dose',
    disease: 'Measles, Mumps, Rubella',
    age: '4-6 years',
    description: 'Second dose of MMR to ensure full immunity, typically given before school entry.',
  },
  {
    id: 'dpt-booster-2',
    name: 'DTP - 2nd Booster',
    disease: 'Diphtheria, Tetanus, Pertussis',
    age: '5-6 years',
    description: 'A second booster for DTP to reinforce protection before children enter school.',
  },
  {
    id: 'hpv',
    name: 'HPV Vaccine',
    disease: 'Human Papillomavirus (causes Cervical Cancer)',
    age: '9-14 years (2 doses)',
    description: 'Protects against HPV, the primary cause of cervical cancer. Recommended for adolescent girls.',
  },
  {
    id: 'tdap-pregnancy',
    name: 'Tdap (during pregnancy)',
    disease: 'Tetanus, Diphtheria, Pertussis',
    age: 'Every pregnancy (between 27 and 36 weeks)',
    description: 'Given during each pregnancy to pass antibodies to the newborn, protecting them from whooping cough in early life.',
  },
  {
    id: 'flu-shot',
    name: 'Influenza (Flu) Vaccine',
    disease: 'Influenza',
    age: 'Annually for all ages (especially elderly and high-risk groups)',
    description: 'An annual shot recommended to protect against seasonal influenza viruses, which change each year.',
  },
];
