# 🔍 DOVE TROVARE SCHEDULE IN MAKE.COM - GUIDA VISUALE

## 🎯 PROBLEMA: Non trovo dove impostare gli orari!

**SOLUZIONE:** Segui questa guida step-by-step con screenshot descriptions

---

## 📋 STEP 1: LOGIN E DASHBOARD

### 1.1 Accesso Make.com:
```
🌐 Vai su: https://make.com
📧 Login con le tue credenziali
📱 Scegli piano Core (€9/mese)
```

### 1.2 Dashboard principale:
```
┌─────────────────────────────────────┐
│ 🚀 Make                             │
│ ┌─────────────────────────────────┐ │
│ │ Welcome to Make                 │ │
│ │                                 │ │
│ │ [+ Create a new scenario]       │ │ ← CLICK QUI!
│ │                                 │ │
│ │ My scenarios  Templates         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## ⚙️ STEP 2: CREARE NUOVO SCENARIO

### 2.1 Scenario Creation:
```
Click "Create a new scenario"
↓
┌─────────────────────────────────────┐
│ Create a new scenario               │
│                                     │
│ Choose how to start:                │
│                                     │
│ 🔍 [Browse app integrations]        │
│ ⚡ [Choose a trigger]               │ ← CLICK QUI!
│ 📝 [Start from scratch]             │
│                                     │
└─────────────────────────────────────┘
```

### 2.2 Scegli Trigger:
```
┌─────────────────────────────────────┐
│ Choose your trigger app             │
│                                     │
│ 🔍 Search for apps...               │ ← CERCA "schedule"
│                                     │
│ Popular triggers:                   │
│ ⏰ Schedule                         │ ← QUESTO!
│ 📧 Gmail                            │
│ 📱 HTTP                             │
│ 🗂️  Google Sheets                   │
│                                     │
└─────────────────────────────────────┘
```

---

## ⏰ STEP 3: CONFIGURARE SCHEDULE MODULE

### 3.1 Schedule Module Selection:
```
┌─────────────────────────────────────┐
│ ⏰ Schedule                          │
│                                     │
│ Trigger options:                    │
│                                     │
│ 📅 [Every day]                     │ ← PER POSTS GIORNALIERI
│ 🔄 [Every week]                     │
│ 📆 [Every month]                    │
│ ⚙️  [Advanced scheduling]           │ ← PER ORARI MULTIPLI
│                                     │
│ [Continue]                          │
└─────────────────────────────────────┘
```

### 3.2 Opzioni Schedule:

#### OPZIONE A: Every Day (Semplice)
```
┌─────────────────────────────────────┐
│ ⏰ Schedule: Every day              │
│                                     │
│ Time: [08:00] ▼                     │ ← IMPOSTA ORARIO
│ Timezone: [Europe/Rome] ▼           │ ← IMPORTANTE!
│                                     │
│ Days of week:                       │
│ ☑️ Mon ☑️ Tue ☑️ Wed ☑️ Thu         │
│ ☑️ Fri ☑️ Sat ☑️ Sun               │ ← SELEZIONA TUTTI
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘
```

#### OPZIONE B: Advanced Scheduling (Raccomandato)
```
┌─────────────────────────────────────┐
│ ⚙️ Advanced scheduling              │
│                                     │
│ Schedule type: [Custom] ▼           │
│                                     │
│ Times:                              │
│ ┌─────┐ [+ Add time]                │
│ │08:00│ ← COLAZIONE                 │
│ └─────┘                             │
│ ┌─────┐                             │  
│ │13:00│ ← PRANZO                    │
│ └─────┘                             │
│ ┌─────┐                             │
│ │18:00│ ← APERITIVO                 │
│ └─────┘                             │
│                                     │
│ Timezone: [Europe/Rome] ▼           │
│ Days: [Every day] ▼                 │
│                                     │
│ [Save configuration]                │
└─────────────────────────────────────┘
```

---

## 🔧 STEP 4: CONFIGURAZIONE DETTAGLIATA

### 4.1 Settings avanzate Schedule:
```
Scenario name: "Balzac Instagram Automation"

⏰ Schedule Module Settings:
├── Trigger: "Schedule"
├── Type: "Advanced scheduling"  
├── Pattern: "Custom times"
├── Times: 
│   ├── 08:00 (Colazione)
│   ├── 13:00 (Pranzo)
│   └── 18:00 (Aperitivo)
├── Timezone: "Europe/Rome"
├── Days: "Monday-Sunday" (all selected)
└── Status: "Active"
```

### 4.2 Interface precisa:
```
┌─────────────────────────────────────┐
│ ⚙️ Schedule Module Configuration    │
│                                     │
│ ┌─ Timing ─────────────────────────┐ │
│ │ Frequency: [Custom] ▼            │ │
│ │                                  │ │
│ │ Custom times:                    │ │
│ │ [08:00] [13:00] [18:00]          │ │ ← ORARI QUI
│ │                                  │ │
│ │ [+ Add another time]             │ │
│ └──────────────────────────────────┘ │
│                                     │
│ ┌─ When ──────────────────────────┐ │  
│ │ Days: ☑️All days                │ │
│ │ Timezone: Europe/Rome ▼          │ │ ← FUSO ORARIO
│ └──────────────────────────────────┘ │
│                                     │
│ [Test] [Save] [Activate]            │
└─────────────────────────────────────┘
```

---

## 🎯 STEP 5: DOPO SCHEDULE - WORKFLOW

### 5.1 Dopo aver configurato Schedule:
```
⏰ Schedule (08:00, 13:00, 18:00)
↓
🔄 Router Module (detect meal type)
↓
🤖 OpenAI Module (generate caption)  
↓
🎨 HTTP Module (Leonardo.ai images)
↓
📱 Instagram Module (publish post)
↓
📧 Notification Module (confirm success)
```

### 5.2 Router Configuration:
```
┌─────────────────────────────────────┐
│ 🔄 Router Module                    │
│                                     │
│ Route 1: Morning (08:00)            │
│ Filter: time = "08:00"              │
│ Output: meal_type = "colazione"     │
│                                     │
│ Route 2: Lunch (13:00)              │
│ Filter: time = "13:00"              │  
│ Output: meal_type = "pranzo"        │
│                                     │
│ Route 3: Aperitivo (18:00)          │
│ Filter: time = "18:00"              │
│ Output: meal_type = "aperitivo"     │
│                                     │
└─────────────────────────────────────┘
```

---

## 🚨 TROUBLESHOOTING COMUNI

### ❌ "Non vedo Schedule module"
**Soluzione:**
```
1. Nella ricerca scrivi esattamente "schedule" 
2. Controlla che sia sotto "Built-in apps"
3. Prova "Clock" se Schedule non appare
4. Refresh la pagina del browser
```

### ❌ "Schedule non si attiva"
**Soluzione:**
```
1. Completa tutto il workflow prima di attivare
2. Test manuale con "Run once" 
3. Verifica che tutti i moduli siano connessi
4. Check timezone = "Europe/Rome"
```

### ❌ "Orari sbagliati"
**Soluzione:**
```
1. Timezone DEVE essere "Europe/Rome"
2. Formato 24 ore (non AM/PM)
3. Considerare ora legale/solare
4. Test con orario corrente per verifica
```

### ❌ "Non parte automaticamente"
**Soluzione:**
```
1. Scenario deve essere "Active" (non Inactive)
2. Verifica quota operazioni Make.com
3. Check connessioni API funzionanti
4. Monitor "History" per errori
```

---

## 📊 STEP 6: MONITORING E TEST

### 6.1 Dashboard Monitoring:
```
Make.com → Scenarios → "Balzac Instagram"

Status Panel:
┌─────────────────────────────────────┐
│ 📊 Balzac Instagram Automation      │
│                                     │
│ Status: 🟢 Active                   │
│ Next run: Today 18:00 (aperitivo)   │
│ Last run: Today 13:00 ✅ Success    │
│                                     │
│ Operations used: 45/10,000          │
│ Success rate: 98%                   │
│                                     │
│ [Pause] [Edit] [History]            │
└─────────────────────────────────────┘
```

### 6.2 History Log:
```
Execution History:
┌─────────────────────────────────────┐
│ 📅 Today 13:00    ✅ Success (3.2s) │
│ 📅 Today 08:00    ✅ Success (2.8s) │
│ 📅 Yesterday 18:00 ✅ Success (4.1s)│
│ 📅 Yesterday 13:00 ❌ Failed (API)  │
│ 📅 Yesterday 08:00 ✅ Success (2.1s)│
└─────────────────────────────────────┘
```

---

## ✅ CHECKLIST FINALE

### Pre-Activation:
- [ ] Account Make.com Core attivato
- [ ] Scenario "Balzac Instagram" creato
- [ ] Schedule module configurato (08:00, 13:00, 18:00)
- [ ] Timezone: Europe/Rome
- [ ] Router per meal types
- [ ] OpenAI module per captions
- [ ] Leonardo HTTP module per images
- [ ] Instagram module per posting
- [ ] Test manuale completato

### Post-Activation:
- [ ] Status = "Active" 
- [ ] First scheduled run verificato
- [ ] Notifications attive
- [ ] Monitoring dashboard controllato
- [ ] Team training completato

---

## 🎉 RISULTATO FINALE

Una volta configurato, il tuo sistema farà:

```
🌅 08:00 → Post colazione automatico
🍝 13:00 → Post pranzo automatico  
🍸 18:00 → Post aperitivo automatico
```

**OGNI GIORNO, 365 giorni/anno, AUTOMATICAMENTE!**

### Timeline Operativa:
- **Oggi:** Setup Make.com scenario
- **Domani:** First automated posts
- **Settimana 1:** Monitor e optimize
- **Mese 1:** Full automation + ROI tracking

**🚀 Domani alle 08:00 il tuo primo post automatico va LIVE!**

---

## 💫 BONUS: ADVANCED TIPS

### Weekend Customization:
```javascript
// Diversi orari weekend
Sabato: 09:00, 13:30, 19:00 (brunch, lunch, dinner)
Domenica: 10:00, 14:00, 17:00 (late breakfast, lunch, early aperitivo)
```

### Seasonal Adjustments:
```javascript
// Estate (Giugno-Agosto)
08:30, 13:00, 19:00 (later evening post)

// Inverno (Dicembre-Febbraio)  
08:00, 12:30, 17:30 (earlier evening post)
```

**Il tuo sistema di automazione Instagram è quasi LIVE!** 🎯🚀