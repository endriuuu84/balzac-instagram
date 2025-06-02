# 🚀 SETUP INSTAGRAM API CON POSTMAN

## STEP 1: TROVA IL PAGE ID

**Request:**
```
GET https://graph.facebook.com/v18.0/me/accounts
```

**Headers:**
```
Authorization: Bearer EAAJzkTU3EK4BO2fKkLu32IT8zwMZCdZCA4YytKy0q2Exl4orByKNCE3MzLyaFSSdBBjtKQnNfhwUh0Jcvm0Ci5cvUSAlkKhqHGkZBbXZB7RzXf4GrS6755Ne3RcAaUSmoxdfTBJSE9mn8FtiO6Nb5ZCXI89knadwM5HiLByqLARlSmATQFU2ZAO7XoDiat2HSpOpMRxkyMKwOH46Ve2dPzIDxguQRKdGKEtIGydxLsyFgB
```

**O più semplice con query parameter:**
```
GET https://graph.facebook.com/v18.0/me/accounts?access_token=EAAJzkTU3EK4BO2fKkLu32IT8zwMZCdZCA4YytKy0q2Exl4orByKNCE3MzLyaFSSdBBjtKQnNfhwUh0Jcvm0Ci5cvUSAlkKhqHGkZBbXZB7RzXf4GrS6755Ne3RcAaUSmoxdfTBJSE9mn8FtiO6Nb5ZCXI89knadwM5HiLByqLARlSmATQFU2ZAO7XoDiat2HSpOpMRxkyMKwOH46Ve2dPzIDxguQRKdGKEtIGydxLsyFgB
```

Questo ti darà:
```json
{
  "data": [
    {
      "access_token": "...",
      "category": "Restaurant",
      "name": "Balzac Bistrot",
      "id": "123456789",  // <-- QUESTO È IL PAGE_ID
      "tasks": ["ANALYZE", "ADVERTISE", "MODERATE", "CREATE_CONTENT"]
    }
  ]
}
```

---

## STEP 2: TROVA INSTAGRAM BUSINESS ACCOUNT ID

Una volta che hai il PAGE_ID, fai questa request:

**Request:**
```
GET https://graph.facebook.com/v18.0/{PAGE_ID}?fields=instagram_business_account&access_token={TOKEN}
```

Esempio:
```
GET https://graph.facebook.com/v18.0/123456789?fields=instagram_business_account&access_token=EAAJzkTU3EK4BO2fKkLu32IT8zwMZCdZCA4YytKy0q2Exl4orByKNCE3MzLyaFSSdBBjtKQnNfhwUh0Jcvm0Ci5cvUSAlkKhqHGkZBbXZB7RzXf4GrS6755Ne3RcAaUSmoxdfTBJSE9mn8FtiO6Nb5ZCXI89knadwM5HiLByqLARlSmATQFU2ZAO7XoDiat2HSpOpMRxkyMKwOH46Ve2dPzIDxguQRKdGKEtIGydxLsyFgB
```

Risposta:
```json
{
  "instagram_business_account": {
    "id": "17841400000000000"  // <-- INSTAGRAM BUSINESS ACCOUNT ID
  },
  "id": "123456789"
}
```

---

## STEP 3: TEST PUBBLICAZIONE

Con l'Instagram Business Account ID, puoi testare la pubblicazione:

**Request:**
```
POST https://graph.facebook.com/v18.0/{INSTAGRAM_BUSINESS_ACCOUNT_ID}/media
```

**Body (form-data o JSON):**
```json
{
  "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1080",
  "caption": "Test post dal Balzac Bistrot! 🍝",
  "access_token": "YOUR_TOKEN"
}
```

---

## POSTMAN COLLECTION PRONTA

Importa questa collection in Postman:

```json
{
  "info": {
    "name": "Balzac Instagram API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Facebook Pages",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "https://graph.facebook.com/v18.0/me/accounts?access_token={{access_token}}",
          "protocol": "https",
          "host": ["graph", "facebook", "com"],
          "path": ["v18.0", "me", "accounts"],
          "query": [
            {
              "key": "access_token",
              "value": "{{access_token}}"
            }
          ]
        }
      }
    },
    {
      "name": "Get Instagram Business Account",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "https://graph.facebook.com/v18.0/{{page_id}}?fields=instagram_business_account&access_token={{access_token}}",
          "protocol": "https",
          "host": ["graph", "facebook", "com"],
          "path": ["v18.0", "{{page_id}}"],
          "query": [
            {
              "key": "fields",
              "value": "instagram_business_account"
            },
            {
              "key": "access_token",
              "value": "{{access_token}}"
            }
          ]
        }
      }
    },
    {
      "name": "Create Instagram Post",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "image_url",
              "value": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1080",
              "type": "text"
            },
            {
              "key": "caption",
              "value": "Test post dal Balzac Bistrot! 🍝 #ModenaFood",
              "type": "text"
            },
            {
              "key": "access_token",
              "value": "{{access_token}}",
              "type": "text"
            }
          ]
        },
        "url": {
          "raw": "https://graph.facebook.com/v18.0/{{instagram_business_account_id}}/media",
          "protocol": "https",
          "host": ["graph", "facebook", "com"],
          "path": ["v18.0", "{{instagram_business_account_id}}", "media"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "access_token",
      "value": "EAAJzkTU3EK4BO2fKkLu32IT8zwMZCdZCA4YytKy0q2Exl4orByKNCE3MzLyaFSSdBBjtKQnNfhwUh0Jcvm0Ci5cvUSAlkKhqHGkZBbXZB7RzXf4GrS6755Ne3RcAaUSmoxdfTBJSE9mn8FtiO6Nb5ZCXI89knadwM5HiLByqLARlSmATQFU2ZAO7XoDiat2HSpOpMRxkyMKwOH46Ve2dPzIDxguQRKdGKEtIGydxLsyFgB"
    },
    {
      "key": "page_id",
      "value": ""
    },
    {
      "key": "instagram_business_account_id",
      "value": ""
    }
  ]
}
```

---

## ISTRUZIONI POSTMAN

1. **Importa la collection** in Postman
2. **Esegui "Get Facebook Pages"** per trovare il PAGE_ID
3. **Aggiorna la variabile** `page_id` con il valore trovato
4. **Esegui "Get Instagram Business Account"** per trovare l'ID Instagram
5. **Aggiorna la variabile** `instagram_business_account_id`
6. **Testa la pubblicazione** con "Create Instagram Post"