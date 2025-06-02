# 🕐 CRON-JOB.ORG - SETUP COMPLETO PER BALZAC

## 📋 STEP 1: REGISTRAZIONE

### 1.1 Vai su cron-job.org
```
🌐 https://cron-job.org
```

### 1.2 Registrati GRATIS
- Click **"Sign Up"** (in alto a destra)
- Email: tua-email@gmail.com
- Password: scegli password sicura
- ✅ Accetta termini
- Click **"Create Account"**

### 1.3 Verifica Email
- Controlla inbox
- Click link di verifica
- Login con credenziali

---

## ⚙️ STEP 2: CREA I 3 CRON JOBS

### 📱 Dashboard cron-job.org:
Una volta loggato, vedrai:
```
Dashboard → Cronjobs → [+ Create cronjob]
```

---

## 🌅 JOB 1: COLAZIONE (08:00)

### Click "Create cronjob" e inserisci:

#### Basic Settings:
```
Title: Balzac Colazione Post
URL: https://hook.eu2.make.com/ouiitebpjbbqlhn5xpfxzvsivfx5i0l9
Schedule: [Custom ▼]
```

#### Schedule Settings:
```
Days: ☑ Mon ☑ Tue ☑ Wed ☑ Thu ☑ Fri ☑ Sat ☑ Sun
Months: ☑ All months selected
Hours: [8] (seleziona solo 8)
Minutes: [0] (seleziona solo 0)
```

#### Advanced Settings:
```
Request Method: POST
Request Headers:
  Content-Type: application/json
  
Request Body:
{
  "trigger": "scheduled_post",
  "meal_type": "colazione",
  "time": "08:00",
  "hashtags": "#colazionemodena #cappuccino #cornetto #buongiorno",
  "mood": "energetic_morning",
  "restaurant": {
    "name": "Balzac Bistrot",
    "location": "Modena, Italy",
    "instagram": "@balzacmodena"
  }
}
```

#### Save Settings:
```
☑ Enable job
☑ Save responses
Timezone: Europe/Rome
[Create cronjob]
```

---

## 🍝 JOB 2: PRANZO (13:00)

### Click "Create cronjob" di nuovo:

#### Basic Settings:
```
Title: Balzac Pranzo Post
URL: https://hook.eu2.make.com/ouiitebpjbbqlhn5xpfxzvsivfx5i0l9
Schedule: [Custom ▼]
```

#### Schedule Settings:
```
Days: ☑ All days
Hours: [13] (seleziona solo 13)
Minutes: [0] (seleziona solo 0)
```

#### Request Body:
```json
{
  "trigger": "scheduled_post",
  "meal_type": "pranzo",
  "time": "13:00",
  "hashtags": "#pranzomodena #tortellini #cucinaitaliana #tagliatelle",
  "mood": "traditional_lunch",
  "restaurant": {
    "name": "Balzac Bistrot",
    "location": "Modena, Italy",
    "instagram": "@balzacmodena"
  }
}
```

---

## 🍸 JOB 3: APERITIVO (18:00)

### Click "Create cronjob" ancora:

#### Basic Settings:
```
Title: Balzac Aperitivo Post
URL: https://hook.eu2.make.com/ouiitebpjbbqlhn5xpfxzvsivfx5i0l9
Schedule: [Custom ▼]
```

#### Schedule Settings:
```
Days: ☑ All days
Hours: [18] (seleziona solo 18)
Minutes: [0] (seleziona solo 0)
```

#### Request Body:
```json
{
  "trigger": "scheduled_post",
  "meal_type": "aperitivo",
  "time": "18:00",
  "hashtags": "#aperitivomodena #spritz #aperol #socialdrinks",
  "mood": "social_evening",
  "restaurant": {
    "name": "Balzac Bistrot",
    "location": "Modena, Italy",
    "instagram": "@balzacmodena"
  }
}
```

---

## 🧪 STEP 3: TEST IMMEDIATO

### Per ogni job creato:

1. **Dalla lista cronjobs**, trova il job
2. Click **"Test run"** (icona play ▶️)
3. Controlla:
   - Status: Should show ✅ Success
   - Response: Should show webhook response
   - Make.com: Check scenario execution

---

## 📊 STEP 4: MONITORING

### Dashboard Overview:
```
Cronjobs → Your Jobs:
┌─────────────────────────────────────┐
│ ✅ Balzac Colazione Post            │
│    Next run: Tomorrow 08:00         │
│    Status: Enabled                  │
│                                     │
│ ✅ Balzac Pranzo Post               │
│    Next run: Today 13:00           │
│    Status: Enabled                  │
│                                     │
│ ✅ Balzac Aperitivo Post            │
│    Next run: Today 18:00           │
│    Status: Enabled                  │
└─────────────────────────────────────┘
```

### Execution History:
```
History → Filter by job:
- See all executions
- Check success/failure
- View response data
- Debug any issues
```

---

## 🔧 STEP 5: TROUBLESHOOTING

### ❌ Job Failed?

#### Check questi punti:
1. **URL corretto:** `https://hook.eu2.make.com/ouiitebpjbbqlhn5xpfxzvsivfx5i0l9`
2. **Method:** Deve essere POST
3. **Headers:** Content-Type: application/json
4. **Body:** JSON valido (copia esattamente)
5. **Make.com scenario:** Deve essere Active

### ❌ Timezone Issues?

#### Settings → Account:
```
Timezone: Europe/Rome
Date format: DD/MM/YYYY
Time format: 24h
```

### ❌ Job Non Parte?

#### Verifica:
- Job è "Enabled" ✅
- Orario corretto selezionato
- Make.com scenario attivo
- Webhook URL funzionante

---

## 📱 STEP 6: NOTIFICATIONS (Optional)

### Email Alerts:
```
Settings → Notifications:
☑ Email on failure
☑ Email on success (first time)
Email: tua-email@gmail.com
```

### Failure Handling:
```
Job Settings → Advanced:
Retry on failure: ☑ Yes
Max retries: 3
Retry delay: 5 minutes
```

---

## ✅ CHECKLIST FINALE

### Controlla di avere:
- [ ] Account cron-job.org verificato
- [ ] 3 cronjobs creati (08:00, 13:00, 18:00)
- [ ] Tutti i job "Enabled"
- [ ] Test run eseguito per ogni job
- [ ] Timezone: Europe/Rome
- [ ] Make.com scenario Active

---

## 🎯 RISULTATO FINALE

### Il tuo sistema ora fa:
```
⏰ 08:00 → Cron-job invia webhook → Make.com crea post colazione
⏰ 13:00 → Cron-job invia webhook → Make.com crea post pranzo
⏰ 18:00 → Cron-job invia webhook → Make.com crea post aperitivo
```

**TUTTO AUTOMATICO, OGNI GIORNO, 365 GIORNI/ANNO!** 🚀

---

## 💡 PRO TIPS

### 1. Monitoring Dashboard:
- Bookmark: https://cron-job.org/en/members/jobs/
- Check daily per prime settimane
- Guarda execution history

### 2. Backup Plan:
- Screenshot settings di ogni job
- Salva JSON body in file separati
- Test settimanale manuale

### 3. Advanced Features:
- Puoi aggiungere weekend speciali
- Orari diversi per stagioni
- Holiday scheduling

---

## 🆘 SUPPORTO

### Se hai problemi:
1. **cron-job.org Support:** support@cron-job.org
2. **Community Forum:** https://cron-job.org/forum
3. **FAQ:** https://cron-job.org/faq

---

## 🎉 CONGRATULAZIONI!

**Il tuo sistema di automazione Instagram è ora COMPLETO al 100%!**

- ✅ Make.com per workflow
- ✅ Cron-job.org per scheduling
- ✅ 3 post automatici al giorno
- ✅ Zero intervento manuale

**DOMANI ALLE 08:00 IL PRIMO POST AUTOMATICO!** 🌅🚀

---

## 📱 QUICK REFERENCE

### I tuoi 3 cron job:
1. **08:00** - Colazione → `{"meal_type": "colazione"}`
2. **13:00** - Pranzo → `{"meal_type": "pranzo"}`
3. **18:00** - Aperitivo → `{"meal_type": "aperitivo"}`

### Webhook URL:
```
https://hook.eu2.make.com/ouiitebpjbbqlhn5xpfxzvsivfx5i0l9
```

**SAVE THIS GUIDE FOR FUTURE REFERENCE!** 📌