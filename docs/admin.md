## **V-Mail Hub Manual Setup Guide**

This document outlines all critical steps that require **manual interaction with the Convex Dashboard** and **external content preparation** (videos, codes). These steps cannot be tracked or automated purely through code commits and must be completed for the application to function.

### **Prerequisites**

* The Next.js project is running locally (npm run dev) and deployed (Vercel).  
* The Convex project has been initialized and is running (npx convex dev).  
* The convex/schema.ts file has been defined and pushed (defining friends and messages tables).  
* All video message files are prepared and ready for upload.

### **Step 1: Friend Access Code Generation (Task I-6)**

This step creates the secure login credentials for each of your friends in the database.

1. **Generate Unique Codes:** For each friend, generate a unique, complex, and memorable secret accessCode (e.g., JupiterFlight7, SilverStream55).  
2. **Access Convex Data:** Navigate to your Convex Dashboard -> **Data** tab.  
3. **Populate friends Table:**  
   * Click **Insert Document** for the friends table.  
   * Insert a document for each friend, ensuring the accessCode is unique.

| Field | Example Value | Notes |
| :---- | :---- | :---- |
| name | "Alice" | The friend's display name. |
| accessCode | "Secret-Code-123" | **Must be unique.** This is their secure login key. |

### **Step 2: Video Content Upload (Task I-7, Part 1)**

This step stores the actual video files in Convex's secure file storage.

1. **Access Convex Files:** Navigate to your **Convex Dashboard** -> **Files** tab.  
2. **Upload Videos:**  
   * Click **Upload File** and select a video message.  
   * **CRITICAL:** Once the upload is complete, **save the resulting storageId** (the unique ID string starting with p...) and note which friend this video is for.  
   * Repeat this for all your video files.

### **Step 3: Message Linking and Metadata (Task I-7, Part 2)**

This step links the content to the correct recipient in the messages table.

1. **Access Convex Data:** Navigate back to the **Data** tab.  
2. **Populate messages Table:**  
   * Click **Insert Document** for the messages table.  
   * **Retrieve IDs:** Look up the friend's \_id from the friends table (recipientId) and use the storageId you saved in Step 2\.  
   * Insert the full message document:

| Field | Example Value | Source |
| :---- | :---- | :---- |
| recipientId | "01p3u..." | Friend's \_id from the friends table. |
| videoStorageId | "p4g7t-..." | ID saved from the **Files** tab upload. |
| title | "Happy Birthday Message" | Descriptive title for the friend's dashboard. |
| isViewed | false | Default state for a new message. |

