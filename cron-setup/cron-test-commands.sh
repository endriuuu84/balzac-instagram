#!/bin/bash
# Test commands per verificare webhook prima di cron-job.org

echo "🧪 CRON-JOB TEST COMMANDS"
echo "========================"
echo ""
echo "Testa questi comandi PRIMA di configurare cron-job.org:"
echo ""

# Webhook URL
WEBHOOK_URL="https://hook.eu2.make.com/ouiitebpjbbqlhn5xpfxzvsivfx5i0l9"

echo "1️⃣ TEST COLAZIONE (08:00):"
echo "curl -X POST $WEBHOOK_URL \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{
    \"trigger\": \"scheduled_post\",
    \"meal_type\": \"colazione\",
    \"time\": \"08:00\",
    \"hashtags\": \"#colazionemodena #cappuccino #cornetto #buongiorno\",
    \"mood\": \"energetic_morning\",
    \"restaurant\": {
      \"name\": \"Balzac Bistrot\",
      \"location\": \"Modena, Italy\",
      \"instagram\": \"@balzacmodena\"
    }
  }'"
echo ""
echo "---"
echo ""

echo "2️⃣ TEST PRANZO (13:00):"
echo "curl -X POST $WEBHOOK_URL \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{
    \"trigger\": \"scheduled_post\",
    \"meal_type\": \"pranzo\",
    \"time\": \"13:00\",
    \"hashtags\": \"#pranzomodena #tortellini #cucinaitaliana #tagliatelle\",
    \"mood\": \"traditional_lunch\",
    \"restaurant\": {
      \"name\": \"Balzac Bistrot\",
      \"location\": \"Modena, Italy\",
      \"instagram\": \"@balzacmodena\"
    }
  }'"
echo ""
echo "---"
echo ""

echo "3️⃣ TEST APERITIVO (18:00):"
echo "curl -X POST $WEBHOOK_URL \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{
    \"trigger\": \"scheduled_post\",
    \"meal_type\": \"aperitivo\",
    \"time\": \"18:00\",
    \"hashtags\": \"#aperitivomodena #spritz #aperol #socialdrinks\",
    \"mood\": \"social_evening\",
    \"restaurant\": {
      \"name\": \"Balzac Bistrot\",
      \"location\": \"Modena, Italy\",
      \"instagram\": \"@balzacmodena\"
    }
  }'"
echo ""
echo "========================"
echo "📝 Copia e incolla questi comandi nel terminale per testare!"
echo "✅ Se ricevi risposta 200 OK, il webhook funziona!"