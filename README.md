# पीलवा कलां ग्राम पंचायत – मतदाता विश्लेषण

React (Vite) वाली वेबसाइट। सभी 9 वार्ड का डेटा `src/data/voters.json` में है।

## कंप्यूटर पर चलाना

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # तैयार फ़ाइलें dist/ में बनती हैं
```

## GitHub + Vercel पर लगाना

```bash
git init 
git add .
git commit -m "पहला वर्ज़न"
git branch -M main
git remote add origin https://github.com/<आपका-नाम>/<रिपॉज़िटरी>.git
git push -u origin main
```

फिर vercel.com पर "Add New → Project" दबाकर यह रिपॉज़िटरी चुनें। Framework अपने आप "Vite" पहचान लेगा। कुछ बदलने की ज़रूरत नहीं।
इसके बाद हर बार `git push` करने पर साइट अपने आप नई बन जाएगी।

लिंक सिर्फ़ कार्यकर्ताओं को दें। इसमें लगभग 3,000 लोगों के नाम और वोटर ID हैं, इसलिए Vercel की Project Settings में Password Protection लगाना बेहतर है (यह सुविधा कुछ प्लान में ही मिलती है)।

## फ़ाइलें

| फ़ाइल | काम |
| --- | --- |
| `src/data/voters.json` | सारा डेटा |
| `src/lib/data.js` | डेटा को पढ़ना, उम्र के वर्ग, गांव और वार्ड की सूची |
| `src/lib/filters.js` | सारे फ़िल्टर, खोज और क्रम (sort) का हिसाब |
| `src/components/Header.jsx` | ऊपर का हिस्सा: वार्ड, खोज, फ़िल्टर |
| `src/components/Home.jsx` | "सार" टैब: गिनती और चार्ट |
| `src/components/DhaniTable.jsx` | "ढाणी तालिका" टैब |
| `src/components/VoterList.jsx` | "मतदाता" टैब |
| `src/styles.css` | सारा रंग-रूप (लाइट और डार्क थीम) |

## डेटा का रूप (`voters.json`)

```
D:  [वार्ड, क्रम संख्या, नाम, पिता/पति का नाम, "P" या "H", घर नं., उम्र, "M" या "F", स्थिति, ढाणी का क्रम, वोटर ID]
DH: [गांव, ढाणी का नाम]       (D में ढाणी का क्रम इसी सूची की पंक्ति संख्या है, 0 से शुरू)
```

स्थिति खाली हो तो वोटर अंतिम सूची में है। "E" मृत, "S" शिफ्ट, "R" दोहरा नाम। घर नंबर डेटा में है पर साइट पर कहीं दिखाया नहीं जाता, क्योंकि वह भरोसेमंद नहीं है।

किसी नाम की वर्तनी ठीक करनी हो तो `voters.json` में उसी पंक्ति का नाम बदलकर `git push` कर दें।

## `standalone/` फ़ोल्डर

इसमें पहले वाली एक फ़ाइल की वेबसाइट (`index.html`) है। React वाले वर्ज़न में कुछ अटके तो इसे सीधे Vercel पर डाल सकते हैं।
