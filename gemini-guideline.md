This design guideline focuses on a **"Modern-Minimalist Reward"** aesthetic. It balances the high energy of your yellow sunburst background with a clean, premium "App-style" interface to ensure the "Self-Reward" message feels sophisticated, not cluttered.

---

## 1. Core Color Palette
The goal is to use the background for energy and the card for clarity.

| Element | Color Name | Hex Code (Approx) | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Background** | Sunburst Yellow | From Image | Overall page backdrop. |
| **Card Face** | Arctic White | `#FFFFFF` | Main card body (creates high contrast). |
| **Scratch Foil** | Matte Gold | `#D4AF37` | The "scratchable" surface layer. |
| **Primary Text** | Charcoal Grey | `#2D3436` | Taglines and headers (easier on eyes than pure black). |
| **Accent Text** | Payday Orange | `#FF7675` | Small highlights or "Win" notifications. |

---

## 2. Typography (The "Voice")
To maintain the minimalist vibe, we use a single font family with varying weights.

* **Primary Font:** **Poppins** (Preferred) or **Montserrat**.
* **Headline (The Hero):**
    * **Text:** "Waktunya Self-Reward!"
    * **Style:** Extra Bold / All Caps.
    * **Placement:** Above the card, centered.
* **Sub-headline / Instruction:**
    * **Text:** "Gosok kartu & temukan kejutan gajianmu"
    * **Style:** Medium / Sentence Case.
    * **Color:** Charcoal with 70% opacity.

---

## 3. The Scratch Card Component
This is the "Hero" of your game. It should look like a physical gift card floating on the screen.

### **The Static State (Before Scratching)**
* **Shape:** Rectangle with **24px corner radius** (Modern/Mobile-first look).
* **Border:** 1px solid `#E0E0E0` to define the card against the white center of the sunburst.
* **Card Surface:** Clean white matte.
* **Scratch Foil Area:** * A centered square or rectangle with a **Matte Gold** finish.
    * **Texture:** Add a very subtle "brushed metal" or "fine diamond" pattern to make it look scratchable.
    * **On-Foil Text:** Small icon of a hand 👆 + "GOSOK DI SINI".

### **The Revealed State (The Prize)**
* **Background:** Once scratched, the area underneath should be a very light grey (`#F5F5F5`) to show depth.
* **Visuals:** Use **Line-Art Icons** (thin black lines) for the rewards (e.g., a simple coffee cup, a shopping bag, or a "Rp" coin).
* **Typography:** The prize amount (e.g., **Rp 50.000**) should be in **Bold Charcoal**.

---

## 4. Imagery & Icons
Since we are avoiding "too many graphics," we use **Iconography** instead of illustrations.

* **Style:** "Outlined" or "Linear" icons. Avoid 3D or heavy gradients.
* **Key Symbols:**
    * **Shopping:** A simple paper bag outline.
    * **Food:** A steaming bowl or coffee cup outline.
    * **Money:** A circle with "Rp" in the center.

---

## 5. UI & Micro-interactions (The "Vibe" Boost)
Minimalism is carried by *movement* rather than *drawings*.

* **The "Glow":** Add a soft white outer glow to the card so it looks like it’s vibrating with energy against the sunburst.
* **The "Dust":** When the user scratches, the "particles" coming off should be **Gold Flakes** to match the foil.
* **The Finish:** Once the card is 80% scratched, the remaining foil should disappear with a **Confetti Pop** (minimalist gold/white circles).

---

## 6. Language & Copy (Bahasa Indonesia)
To keep the "Indonesian PayDay" vibe relatable:

* **Main Tagline:** **WAKTUNYA SELF-REWARD!**
* **CTA (Button):** **Ambil Hadiah** (Take Prize) or **Cek Sekarang**.
* **Empty State:** **Coba Lagi Besok** (Try again tomorrow).

---

### **Visual Hierarchy Summary**
1.  **Background:** High-energy Yellow Sunburst (Visual hook).
2.  **Tagline:** "Waktunya Self-Reward!" (Emotional hook).
3.  **Card:** Clean White Minimalist (The Action center).
4.  **Prize:** Simple Line Icon + Text (The Gratification).