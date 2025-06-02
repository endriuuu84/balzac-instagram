# ⏰ MAKE.COM SCHEDULING - GUIDA COMPLETA

## 🎯 OBIETTIVO: 3 POST AUTOMATICI/GIORNO

### Scheduling Balzac:
- **08:00** - Colazione post
- **13:00** - Pranzo post  
- **18:00** - Aperitivo post

---

## 📋 STEP 1: ACCESSO MAKE.COM

### 1.1 Registrazione:
```
🌐 Vai su: https://make.com
📧 Email: tua-email@balzacbistrot.com
📱 Plan: Core ($9/mese)
```

### 1.2 Accesso Dashboard:
```
Login → Dashboard → "Create a new scenario"
```

---

## ⚙️ STEP 2: TROVARE SCHEDULING MODULE

### 2.1 Nel Dashboard Make.com:
1. **Click "Create a new scenario"**
2. **Search modules:** cerca "schedule"
3. **Seleziona "Schedule" module** (icona orologio ⏰)

### 2.2 Schedule Module Location:
```
Apps Menu → Built-in Apps → Schedule
O
Search bar → "schedule" → Select Schedule
```

![Schedule Module](https://example.com/schedule-icon.png)

---

## 🕐 STEP 3: CONFIGURARE SCHEDULE

### 3.1 Basic Settings:
```javascript
Scenario name: "Balzac Daily Instagram Posts"
Schedule type: "Interval" 
Time zone: "Europe/Rome"
```

### 3.2 Timing Configuration:
```javascript
// OPZIONE A: Multiple Single Schedules
Schedule 1: Daily at 08:00 (Colazione)
Schedule 2: Daily at 13:00 (Pranzo)  
Schedule 3: Daily at 18:00 (Aperitivo)

// OPZIONE B: Advanced Scheduling (Recommended)
Pattern: "Custom intervals"
Times: 08:00, 13:00, 18:00
Frequency: "Daily"
Days: "Monday through Sunday"
```

---

## 🔧 STEP 4: ADVANCED SCHEDULING

### 4.1 Configurazione Dettagliata:

#### Schedule Module Settings:
```javascript
{
  "scheduleType": "interval",
  "interval": [
    {
      "time": "08:00",
      "timezone": "Europe/Rome",
      "days": [1,2,3,4,5,6,7]  // Mon-Sun
    },
    {
      "time": "13:00", 
      "timezone": "Europe/Rome",
      "days": [1,2,3,4,5,6,7]
    },
    {
      "time": "18:00",
      "timezone": "Europe/Rome", 
      "days": [1,2,3,4,5,6,7]
    }
  ]
}
```

### 4.2 Screenshot Locations:
```
Schedule Module → Settings → Advanced Options
├── Time Zone: "Europe/Rome"
├── Interval Type: "Daily"
├── Specific Times: "08:00, 13:00, 18:00"
└── Days: "All days selected"
```

---

## 📸 STEP 5: VISUAL GUIDE

### 5.1 Dove Trovare Schedule Settings:

```
Make.com Dashboard
├── Scenarios
├── Create new scenario
├── Add Module (+)
│   ├── 🔍 Search: "schedule"
│   └── 📅 Select: "Schedule"
└── Configure Schedule
    ├── ⏰ Time Zone: Europe/Rome
    ├── 📅 Pattern: Custom
    ├── 🕐 Times: 08:00, 13:00, 18:00
    └── 📆 Days: Mon-Sun
```

### 5.2 Interface Screenshots:

#### Main Dashboard:
```
┌─────────────────────────────────┐
│ 🚀 Make                         │
│ ├── Scenarios                   │
│ ├── Templates                   │
│ └── [+ Create new scenario]     │ ← CLICK QUI
└─────────────────────────────────┘
```

#### Module Selection:
```
┌─────────────────────────────────┐
│ Add a module                    │
│ 🔍 Search modules...            │ ← CERCA "schedule"
│ ┌─────────────────────────────┐ │
│ │ ⏰ Schedule                 │ │ ← SELEZIONA QUESTO
│ │ 📧 Email                   │ │
│ │ 📱 HTTP                    │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

#### Schedule Configuration:
```
┌─────────────────────────────────┐
│ ⏰ Schedule Settings            │
│                                 │
│ Scheduling: [Advanced ▼]        │
│ Time zone: [Europe/Rome ▼]      │
│ Pattern: [Custom times ▼]       │
│                                 │
│ Times:                          │
│ ┌─────┐ ┌─────┐ ┌─────┐         │
│ │08:00│ │13:00│ │18:00│         │ ← INSERISCI QUI
│ └─────┘ └─────┘ └─────┘         │
│                                 │
│ Days: ☑️ All selected           │
│                                 │
│ [Save] [Test]                   │
└─────────────────────────────────┘
```

---

## 🎯 STEP 6: CONFIGURAZIONE MEAL TYPES

### 6.1 Logic per Meal Detection:
```javascript
// In Make.com Router Module
IF current_time = "08:00" THEN meal_type = "colazione"
IF current_time = "13:00" THEN meal_type = "pranzo"  
IF current_time = "18:00" THEN meal_type = "aperitivo"
```

### 6.2 Workflow Completo:
```
⏰ Schedule (08:00/13:00/18:00)
↓
🔄 Router (detect meal type)
↓  
🤖 OpenAI (generate content for meal_type)
↓
🎨 Leonardo.ai (generate food image)
↓
📱 Instagram (publish post)
↓
📧 Slack (confirm success)
```

---

## 🛠️ STEP 7: IMPLEMENTAZIONE PRATICA

### 7.1 Scenario Creation:
```
1. Login Make.com
2. Dashboard → "Create new scenario"
3. Name: "Balzac Instagram Automation"
4. Add Schedule module
5. Configure times: 08:00, 13:00, 18:00
6. Add Router for meal detection
7. Connect OpenAI module
8. Connect Leonardo module  
9. Connect Instagram module
10. Test & Activate
```

### 7.2 Testing Schedule:
```javascript
// Test immediato
Manual Run: "Run once"

// Test scheduling  
Next Run: Shows next scheduled time
Status: "Active" or "Inactive"
History: Shows past executions
```

---

## 📊 STEP 8: MONITORING SCHEDULE

### 8.1 Dashboard Monitoring:
```
Make.com Dashboard → Scenarios → "Balzac Instagram"
├── Status: 🟢 Active
├── Next run: "Today 18:00"
├── Last run: "Today 13:00 - Success"
├── Operations used: "45/10,000"
└── Success rate: "98%"
```

### 8.2 History & Logs:
```
Scenario → History → Executions
┌─────────────────────────────────┐
│ Today 13:00  ✅ Success (3s)    │
│ Today 08:00  ✅ Success (4s)    │  
│ Yesterday 18:00 ✅ Success (2s) │
│ Yesterday 13:00 ✅ Success (3s) │
└─────────────────────────────────┘
```

---

## 🚨 TROUBLESHOOTING SCHEDULE

### Common Issues:

#### ❌ Schedule Not Running:
```
Check:
1. Scenario is "Active" (not paused)
2. Time zone = "Europe/Rome"
3. No missing connections in workflow
4. Operations quota not exceeded
```

#### ❌ Wrong Timing:
```
Fix:
1. Verify time zone setting
2. Check daylight saving time
3. Confirm 24-hour format (not AM/PM)
4. Test with manual run first
```

#### ❌ Missing Executions:
```
Causes:
1. API limits reached
2. Module errors in chain
3. Insufficient Make.com operations
4. Network connectivity issues
```

---

## 🎯 STEP 9: OTTIMIZZAZIONE

### 9.1 Performance Tips:
```javascript
// Faster execution
- Use lightweight modules first
- Cache frequently used data  
- Minimize API calls per run
- Set appropriate timeouts

// Better reliability
- Add error handling routes
- Include retry mechanisms
- Monitor operation usage
- Set up failure notifications
```

### 9.2 Cost Optimization:
```
Core Plan: €9/mese = 10,000 operations
Daily posts: 3 × 30 giorni = 90 operations
Monthly usage: ~300 operations (includes monitoring)
Remaining: 9,700 operations for expansion!
```

---

## 📋 QUICK START CHECKLIST

### Pre-Setup:
- [ ] Account Make.com creato
- [ ] Piano Core attivato (€9/mese)
- [ ] Tutte le API keys pronte

### Schedule Setup:
- [ ] Scenario "Balzac Instagram" creato
- [ ] Schedule module aggiunto
- [ ] Time zone: Europe/Rome
- [ ] Times: 08:00, 13:00, 18:00
- [ ] Days: All selected
- [ ] Test manuale eseguito

### Workflow Complete:
- [ ] Router per meal type
- [ ] OpenAI per content  
- [ ] Leonardo per images
- [ ] Instagram per posting
- [ ] Notifications per conferma

### Activation:
- [ ] Scenario attivato
- [ ] First scheduled run verificato
- [ ] Monitoring dashboard checked
- [ ] Team notificato

---

## 🎉 RISULTATO FINALE

### Il Tuo Schedule Sarà:
- ⏰ **3x posts automatici/giorno**
- 🎯 **Timing perfetto** per engagement
- 🤖 **Zero intervento manuale**
- 📊 **Monitoring completo**
- 💰 **Costo ottimizzato**

### Timeline Operativa:
```
08:00 → Post colazione → Engagement mattina
13:00 → Post pranzo → Peak lunchtime
18:00 → Post aperitivo → Evening social time
```

**🚀 Domani alle 08:00 il tuo primo post automatico va live!**

---

## 💫 NEXT LEVEL

Una volta che lo scheduling funziona:
1. **Aggiungi weekend specials** (Sabato/Domenica diversi)
2. **Festivi personalizzati** (Natale, Pasqua, etc)
3. **Seasonal campaigns** (Estate/Inverno menus)
4. **Event-based posting** (Sagre, festival)

**Il futuro dell'automazione Balzac starts NOW!** 🚀