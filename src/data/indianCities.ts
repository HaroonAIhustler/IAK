export type CityOption = {
  city: string;
  state: string;
  aliases?: string[];
  priority?: number;
};

const baseCities: CityOption[] = [
  { city: "Mumbai", state: "Maharashtra", aliases: ["Bombay"], priority: 100 },
  { city: "Delhi", state: "Delhi", aliases: ["New Delhi"], priority: 100 },
  { city: "Bengaluru", state: "Karnataka", aliases: ["Bangalore", "Bengluru"], priority: 100 },
  { city: "Hyderabad", state: "Telangana", priority: 95 },
  { city: "Chennai", state: "Tamil Nadu", aliases: ["Madras"], priority: 95 },
  { city: "Pune", state: "Maharashtra", priority: 95 },
  { city: "Kolkata", state: "West Bengal", aliases: ["Calcutta"], priority: 95 },
  { city: "Ahmedabad", state: "Gujarat", priority: 90 },
  { city: "Gurugram", state: "Haryana", aliases: ["Gurgaon"], priority: 90 },
  { city: "Noida", state: "Uttar Pradesh", priority: 90 },
  { city: "Ghaziabad", state: "Uttar Pradesh", priority: 80 },
  { city: "Faridabad", state: "Haryana", priority: 80 },
  { city: "Jaipur", state: "Rajasthan", priority: 85 },
  { city: "Lucknow", state: "Uttar Pradesh", priority: 85 },
  { city: "Indore", state: "Madhya Pradesh", priority: 80 },
  { city: "Bhopal", state: "Madhya Pradesh", priority: 80 },
  { city: "Nagpur", state: "Maharashtra", priority: 80 },
  { city: "Nashik", state: "Maharashtra", priority: 75 },
  { city: "Thane", state: "Maharashtra", priority: 75 },
  { city: "Navi Mumbai", state: "Maharashtra", priority: 75 },
  { city: "Surat", state: "Gujarat", priority: 80 },
  { city: "Vadodara", state: "Gujarat", aliases: ["Baroda"], priority: 75 },
  { city: "Rajkot", state: "Gujarat", priority: 70 },
  { city: "Chandigarh", state: "Chandigarh", priority: 80 },
  { city: "Mohali", state: "Punjab", aliases: ["SAS Nagar"], priority: 75 },
  { city: "Ludhiana", state: "Punjab", priority: 70 },
  { city: "Amritsar", state: "Punjab", priority: 70 },
  { city: "Kochi", state: "Kerala", aliases: ["Cochin"], priority: 75 },
  { city: "Thiruvananthapuram", state: "Kerala", aliases: ["Trivandrum"], priority: 70 },
  { city: "Kozhikode", state: "Kerala", aliases: ["Calicut"], priority: 65 },
  { city: "Coimbatore", state: "Tamil Nadu", priority: 75 },
  { city: "Madurai", state: "Tamil Nadu", priority: 65 },
  { city: "Tiruchirappalli", state: "Tamil Nadu", aliases: ["Trichy"], priority: 60 },
  { city: "Mysuru", state: "Karnataka", aliases: ["Mysore"], priority: 70 },
  { city: "Mangaluru", state: "Karnataka", aliases: ["Mangalore"], priority: 60 },
  { city: "Visakhapatnam", state: "Andhra Pradesh", aliases: ["Vizag"], priority: 70 },
  { city: "Vijayawada", state: "Andhra Pradesh", priority: 65 },
  { city: "Guntur", state: "Andhra Pradesh", priority: 55 },
  { city: "Warangal", state: "Telangana", priority: 60 },
  { city: "Patna", state: "Bihar", priority: 70 },
  { city: "Ranchi", state: "Jharkhand", priority: 65 },
  { city: "Jamshedpur", state: "Jharkhand", priority: 60 },
  { city: "Bhubaneswar", state: "Odisha", priority: 70 },
  { city: "Cuttack", state: "Odisha", priority: 55 },
  { city: "Guwahati", state: "Assam", priority: 70 },
  { city: "Raipur", state: "Chhattisgarh", priority: 65 },
  { city: "Bilaspur", state: "Chhattisgarh", priority: 55 },
  { city: "Dehradun", state: "Uttarakhand", priority: 65 },
  { city: "Haridwar", state: "Uttarakhand", priority: 55 },
  { city: "Prayagraj", state: "Uttar Pradesh", aliases: ["Allahabad"], priority: 65 },
  { city: "Kanpur", state: "Uttar Pradesh", priority: 65 },
  { city: "Varanasi", state: "Uttar Pradesh", priority: 60 },
  { city: "Agra", state: "Uttar Pradesh", priority: 60 },
  { city: "Meerut", state: "Uttar Pradesh", priority: 55 },
  { city: "Jodhpur", state: "Rajasthan", priority: 60 },
  { city: "Udaipur", state: "Rajasthan", priority: 55 },
  { city: "Kota", state: "Rajasthan", priority: 55 },
  { city: "Goa", state: "Goa", aliases: ["Panaji", "Panjim", "Margao"], priority: 60 },
  { city: "Panaji", state: "Goa", aliases: ["Panjim"], priority: 55 },
  { city: "Jammu", state: "Jammu and Kashmir", priority: 55 },
  { city: "Srinagar", state: "Jammu and Kashmir", priority: 55 },
  { city: "Shimla", state: "Himachal Pradesh", priority: 50 },
  { city: "Dharamshala", state: "Himachal Pradesh", priority: 45 },
  { city: "Gangtok", state: "Sikkim", priority: 45 },
  { city: "Shillong", state: "Meghalaya", priority: 45 },
  { city: "Aizawl", state: "Mizoram", priority: 40 },
  { city: "Imphal", state: "Manipur", priority: 40 },
  { city: "Kohima", state: "Nagaland", priority: 40 },
  { city: "Itanagar", state: "Arunachal Pradesh", priority: 40 },
  { city: "Agartala", state: "Tripura", priority: 40 },
  { city: "Puducherry", state: "Puducherry", aliases: ["Pondicherry"], priority: 50 },
  { city: "Port Blair", state: "Andaman and Nicobar Islands", priority: 40 },
  { city: "Daman", state: "Dadra and Nagar Haveli and Daman and Diu", priority: 35 },
  { city: "Silvassa", state: "Dadra and Nagar Haveli and Daman and Diu", priority: 35 }
];

const requestedCityRows = `
Andhra Pradesh	Amaravati
Andhra Pradesh	Visakhapatnam
Andhra Pradesh	Vijayawada
Andhra Pradesh	Guntur
Andhra Pradesh	Nellore
Andhra Pradesh	Kurnool
Andhra Pradesh	Tirupati
Andhra Pradesh	Rajahmundry
Andhra Pradesh	Kakinada
Andhra Pradesh	Eluru
Andhra Pradesh	Kadapa
Andhra Pradesh	Anantapur
Andhra Pradesh	Ongole
Andhra Pradesh	Machilipatnam
Andhra Pradesh	Tenali
Arunachal Pradesh	Itanagar
Arunachal Pradesh	Naharlagun
Arunachal Pradesh	Pasighat
Arunachal Pradesh	Tawang
Arunachal Pradesh	Ziro
Arunachal Pradesh	Tezu
Arunachal Pradesh	Roing
Arunachal Pradesh	Bomdila
Arunachal Pradesh	Aalo
Arunachal Pradesh	Namsai
Arunachal Pradesh	Khonsa
Arunachal Pradesh	Seppa
Arunachal Pradesh	Daporijo
Arunachal Pradesh	Yingkiong
Arunachal Pradesh	Basar
Assam	Dispur
Assam	Guwahati
Assam	Silchar
Assam	Dibrugarh
Assam	Jorhat
Assam	Nagaon
Assam	Tinsukia
Assam	Tezpur
Assam	Bongaigaon
Assam	Sivasagar
Assam	Goalpara
Assam	Diphu
Assam	Dhubri
Assam	Karimganj
Assam	Haflong
Bihar	Patna
Bihar	Gaya
Bihar	Bhagalpur
Bihar	Muzaffarpur
Bihar	Darbhanga
Bihar	Purnia
Bihar	Bihar Sharif
Bihar	Ara
Bihar	Begusarai
Bihar	Katihar
Bihar	Munger
Bihar	Chapra
Bihar	Sasaram
Bihar	Sitamarhi
Bihar	Motihari
Chhattisgarh	Raipur
Chhattisgarh	Bhilai
Chhattisgarh	Durg
Chhattisgarh	Bilaspur
Chhattisgarh	Korba
Chhattisgarh	Rajnandgaon
Chhattisgarh	Jagdalpur
Chhattisgarh	Raigarh
Chhattisgarh	Ambikapur
Chhattisgarh	Dhamtari
Chhattisgarh	Mahasamund
Chhattisgarh	Janjgir
Chhattisgarh	Champa
Chhattisgarh	Kanker
Chhattisgarh	Kawardha
Goa	Panaji
Goa	Margao
Goa	Vasco da Gama
Goa	Mapusa
Goa	Ponda
Goa	Bicholim
Goa	Sanquelim
Goa	Valpoi
Goa	Cuncolim
Goa	Curchorem
Goa	Quepem
Goa	Pernem
Goa	Canacona
Goa	Sanguem
Goa	Dharbandora
Gujarat	Gandhinagar
Gujarat	Ahmedabad
Gujarat	Surat
Gujarat	Vadodara
Gujarat	Rajkot
Gujarat	Bhavnagar
Gujarat	Jamnagar
Gujarat	Junagadh
Gujarat	Anand
Gujarat	Nadiad
Gujarat	Morbi
Gujarat	Bharuch
Gujarat	Porbandar
Gujarat	Navsari
Gujarat	Vapi
Haryana	Chandigarh
Haryana	Faridabad
Haryana	Gurugram
Haryana	Panipat
Haryana	Ambala
Haryana	Karnal
Haryana	Hisar
Haryana	Rohtak
Haryana	Sonipat
Haryana	Yamunanagar
Haryana	Bhiwani
Haryana	Sirsa
Haryana	Rewari
Haryana	Jind
Haryana	Kurukshetra
Himachal Pradesh	Shimla
Himachal Pradesh	Dharamshala
Himachal Pradesh	Solan
Himachal Pradesh	Mandi
Himachal Pradesh	Kullu
Himachal Pradesh	Hamirpur
Himachal Pradesh	Nahan
Himachal Pradesh	Una
Himachal Pradesh	Chamba
Himachal Pradesh	Bilaspur
Himachal Pradesh	Palampur
Himachal Pradesh	Kangra
Himachal Pradesh	Sundarnagar
Himachal Pradesh	Keylong
Himachal Pradesh	Rekong Peo
Jharkhand	Ranchi
Jharkhand	Jamshedpur
Jharkhand	Dhanbad
Jharkhand	Bokaro
Jharkhand	Hazaribagh
Jharkhand	Deoghar
Jharkhand	Giridih
Jharkhand	Ramgarh
Jharkhand	Medininagar
Jharkhand	Chirkunda
Jharkhand	Phusro
Jharkhand	Chaibasa
Jharkhand	Dumka
Jharkhand	Sahibganj
Jharkhand	Gumla
Karnataka	Bengaluru
Karnataka	Mysuru
Karnataka	Hubballi
Karnataka	Dharwad
Karnataka	Mangaluru
Karnataka	Belagavi
Karnataka	Kalaburagi
Karnataka	Ballari
Karnataka	Shivamogga
Karnataka	Davanagere
Karnataka	Udupi
Karnataka	Vijayapura
Karnataka	Hassan
Karnataka	Raichur
Karnataka	Tumakuru
Kerala	Thiruvananthapuram
Kerala	Kochi
Kerala	Kozhikode
Kerala	Thrissur
Kerala	Kollam
Kerala	Kannur
Kerala	Alappuzha
Kerala	Palakkad
Kerala	Kottayam
Kerala	Malappuram
Kerala	Kasaragod
Kerala	Pathanamthitta
Kerala	Idukki
Kerala	Ponnani
Kerala	Tirur
Madhya Pradesh	Bhopal
Madhya Pradesh	Indore
Madhya Pradesh	Jabalpur
Madhya Pradesh	Gwalior
Madhya Pradesh	Ujjain
Madhya Pradesh	Sagar
Madhya Pradesh	Satna
Madhya Pradesh	Rewa
Madhya Pradesh	Ratlam
Madhya Pradesh	Dewas
Madhya Pradesh	Singrauli
Madhya Pradesh	Burhanpur
Madhya Pradesh	Chhindwara
Madhya Pradesh	Shivpuri
Madhya Pradesh	Vidisha
Maharashtra	Mumbai
Maharashtra	Pune
Maharashtra	Nagpur
Maharashtra	Nashik
Maharashtra	Thane
Maharashtra	Aurangabad
Maharashtra	Solapur
Maharashtra	Kolhapur
Maharashtra	Amravati
Maharashtra	Nanded
Maharashtra	Jalgaon
Maharashtra	Akola
Maharashtra	Latur
Maharashtra	Ahmednagar
Maharashtra	Chandrapur
Manipur	Imphal
Manipur	Thoubal
Manipur	Bishnupur
Manipur	Churachandpur
Manipur	Ukhrul
Manipur	Kakching
Manipur	Senapati
Manipur	Tamenglong
Manipur	Jiribam
Manipur	Moreh
Manipur	Moirang
Manipur	Ningthoukhong
Manipur	Andro
Manipur	Yairipok
Manipur	Lilong
Meghalaya	Shillong
Meghalaya	Tura
Meghalaya	Jowai
Meghalaya	Nongstoin
Meghalaya	Williamnagar
Meghalaya	Baghmara
Meghalaya	Resubelpara
Meghalaya	Mairang
Meghalaya	Nongpoh
Meghalaya	Ampati
Meghalaya	Khliehriat
Meghalaya	Amlarem
Meghalaya	Cherrapunji
Meghalaya	Mendipathar
Meghalaya	Dadenggre
Mizoram	Aizawl
Mizoram	Lunglei
Mizoram	Champhai
Mizoram	Serchhip
Mizoram	Kolasib
Mizoram	Saiha
Mizoram	Mamit
Mizoram	Lawngtlai
Mizoram	Saitual
Mizoram	Khawzawl
Mizoram	Hnahthial
Mizoram	Bairabi
Mizoram	Thenzawl
Mizoram	Vairengte
Mizoram	Zawlnuam
Nagaland	Kohima
Nagaland	Dimapur
Nagaland	Mokokchung
Nagaland	Tuensang
Nagaland	Wokha
Nagaland	Zunheboto
Nagaland	Mon
Nagaland	Phek
Nagaland	Kiphire
Nagaland	Longleng
Nagaland	Peren
Nagaland	Jalukie
Nagaland	Pfutsero
Nagaland	Tseminyu
Nagaland	Chümoukedima
Odisha	Bhubaneswar
Odisha	Cuttack
Odisha	Rourkela
Odisha	Berhampur
Odisha	Sambalpur
Odisha	Puri
Odisha	Balasore
Odisha	Baripada
Odisha	Jharsuguda
Odisha	Jeypore
Odisha	Bhadrak
Odisha	Angul
Odisha	Dhenkanal
Odisha	Kendujhar
Odisha	Rayagada
Punjab	Chandigarh
Punjab	Ludhiana
Punjab	Amritsar
Punjab	Jalandhar
Punjab	Patiala
Punjab	Bathinda
Punjab	Mohali
Punjab	Hoshiarpur
Punjab	Pathankot
Punjab	Moga
Punjab	Firozpur
Punjab	Sangrur
Punjab	Barnala
Punjab	Abohar
Punjab	Malerkotla
Rajasthan	Jaipur
Rajasthan	Jodhpur
Rajasthan	Udaipur
Rajasthan	Kota
Rajasthan	Ajmer
Rajasthan	Bikaner
Rajasthan	Alwar
Rajasthan	Bharatpur
Rajasthan	Sikar
Rajasthan	Pali
Rajasthan	Bhilwara
Rajasthan	Chittorgarh
Rajasthan	Barmer
Rajasthan	Nagaur
Rajasthan	Sri Ganganagar
Sikkim	Gangtok
Sikkim	Namchi
Sikkim	Mangan
Sikkim	Gyalshing
Sikkim	Singtam
Sikkim	Rangpo
Sikkim	Jorethang
Sikkim	Melli
Sikkim	Rhenock
Sikkim	Nayabazar
Sikkim	Soreng
Sikkim	Ravangla
Sikkim	Chungthang
Sikkim	Dikchu
Sikkim	Rongli
Tamil Nadu	Chennai
Tamil Nadu	Coimbatore
Tamil Nadu	Madurai
Tamil Nadu	Tiruchirappalli
Tamil Nadu	Salem
Tamil Nadu	Tiruppur
Tamil Nadu	Erode
Tamil Nadu	Vellore
Tamil Nadu	Thanjavur
Tamil Nadu	Thoothukudi
Tamil Nadu	Dindigul
Tamil Nadu	Nagercoil
Tamil Nadu	Karur
Tamil Nadu	Cuddalore
Tamil Nadu	Kanchipuram
Telangana	Hyderabad
Telangana	Warangal
Telangana	Nizamabad
Telangana	Karimnagar
Telangana	Khammam
Telangana	Ramagundam
Telangana	Mahabubnagar
Telangana	Nalgonda
Telangana	Adilabad
Telangana	Suryapet
Telangana	Siddipet
Telangana	Sangareddy
Telangana	Jagitial
Telangana	Mancherial
Telangana	Kamareddy
Tripura	Agartala
Tripura	Udaipur
Tripura	Dharmanagar
Tripura	Kailasahar
Tripura	Belonia
Tripura	Khowai
Tripura	Ambassa
Tripura	Sabroom
Tripura	Sonamura
Tripura	Amarpur
Tripura	Kumarghat
Tripura	Teliamura
Tripura	Kamalpur
Tripura	Jirania
Tripura	Bishalgarh
Uttar Pradesh	Lucknow
Uttar Pradesh	Kanpur
Uttar Pradesh	Ghaziabad
Uttar Pradesh	Agra
Uttar Pradesh	Varanasi
Uttar Pradesh	Prayagraj
Uttar Pradesh	Meerut
Uttar Pradesh	Noida
Uttar Pradesh	Bareilly
Uttar Pradesh	Aligarh
Uttar Pradesh	Moradabad
Uttar Pradesh	Gorakhpur
Uttar Pradesh	Jhansi
Uttar Pradesh	Saharanpur
Uttar Pradesh	Ayodhya
Uttarakhand	Dehradun
Uttarakhand	Haridwar
Uttarakhand	Haldwani
Uttarakhand	Roorkee
Uttarakhand	Rudrapur
Uttarakhand	Kashipur
Uttarakhand	Rishikesh
Uttarakhand	Nainital
Uttarakhand	Pithoragarh
Uttarakhand	Almora
Uttarakhand	Srinagar
Uttarakhand	Mussoorie
Uttarakhand	Kotdwar
Uttarakhand	Tehri
Uttarakhand	Champawat
West Bengal	Kolkata
West Bengal	Asansol
West Bengal	Durgapur
West Bengal	Siliguri
West Bengal	Howrah
West Bengal	Darjeeling
West Bengal	Kharagpur
West Bengal	Haldia
West Bengal	Malda
West Bengal	Baharampur
West Bengal	Raiganj
West Bengal	Cooch Behar
West Bengal	Jalpaiguri
West Bengal	Krishnanagar
West Bengal	Balurghat
Chandigarh	Chandigarh
Delhi	New Delhi
Jammu and Kashmir	Srinagar
Jammu and Kashmir	Jammu
Jammu and Kashmir	Anantnag
Jammu and Kashmir	Baramulla
Jammu and Kashmir	Sopore
Jammu and Kashmir	Kathua
Jammu and Kashmir	Udhampur
Jammu and Kashmir	Pulwama
Jammu and Kashmir	Rajouri
Jammu and Kashmir	Kupwara
Ladakh	Leh
Ladakh	Kargil
Puducherry	Karaikal
Puducherry	Mahe
Puducherry	Yanam
Puducherry	Oulgaret
`;

const aliasesByCity: Record<string, string[]> = {
  Gurugram: ["Gurgaon"],
  Bengaluru: ["Bangalore", "Bengluru"],
  Mumbai: ["Bombay"],
  Kolkata: ["Calcutta"],
  Thiruvananthapuram: ["Trivandrum"],
  Prayagraj: ["Allahabad"],
  Vadodara: ["Baroda"],
  Kozhikode: ["Calicut"],
  Chennai: ["Madras"],
  Mysuru: ["Mysore"],
  Mangaluru: ["Mangalore"],
  Kochi: ["Cochin"],
  Puducherry: ["Pondicherry"],
  Panaji: ["Panjim"]
};

function parseRequestedCities() {
  return requestedCityRows
    .trim()
    .split("\n")
    .map((row) => {
      const [state, city] = row.split("\t");
      return {
        city,
        state,
        aliases: aliasesByCity[city],
        priority: 35
      } satisfies CityOption;
    });
}

function mergeCities(options: CityOption[]) {
  const map = new Map<string, CityOption>();

  for (const option of options) {
    const key = `${option.city}-${option.state}`;
    const existing = map.get(key);
    map.set(key, {
      ...existing,
      ...option,
      aliases: Array.from(new Set([...(existing?.aliases ?? []), ...(option.aliases ?? [])])),
      priority: Math.max(existing?.priority ?? 0, option.priority ?? 0)
    });
  }

  return [...map.values(), { city: "Other", state: "Other", priority: -1 }];
}

export const indianCities: CityOption[] = mergeCities([...baseCities, ...parseRequestedCities()]);

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function scoreMatch(option: CityOption, query: string) {
  const normalizedQuery = normalize(query);
  const candidates = [option.city, option.state, ...(option.aliases ?? [])].map(normalize);

  if (!normalizedQuery) return option.priority ?? 0;
  if (candidates.some((candidate) => candidate === normalizedQuery)) return 1000 + (option.priority ?? 0);
  if (candidates.some((candidate) => candidate.startsWith(normalizedQuery))) return 700 + (option.priority ?? 0);
  if (candidates.some((candidate) => candidate.includes(normalizedQuery))) return 500 + (option.priority ?? 0);

  const fuzzyHit = candidates.some((candidate) => {
    let index = 0;
    for (const char of normalizedQuery) {
      index = candidate.indexOf(char, index);
      if (index === -1) return false;
      index += 1;
    }
    return true;
  });

  return fuzzyHit ? 250 + (option.priority ?? 0) : -1;
}

export function searchCities(query: string) {
  return indianCities
    .map((option) => ({ option, rank: scoreMatch(option, query) }))
    .filter(({ rank, option }) => rank >= 0 || option.city === "Other")
    .sort((a, b) => b.rank - a.rank)
    .map(({ option }) => option)
    .slice(0, 8);
}
