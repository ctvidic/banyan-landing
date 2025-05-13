# Product Requirements Document: Interactive Micro-Lesson Demo

## 1. Introduction & Goals

### 1.1. Introduction
This document outlines the requirements for an interactive micro-lesson demo to be integrated into the existing company website. The feature will provide users with a "swipe up and down" UI to navigate through a short, preloaded micro-lesson. At the end of the lesson, users will take a brief quiz. To receive their results, users will be prompted to provide their email address.

### 1.2. Goals
*   **Showcase Product Value:** Provide a tangible example of the application's learning experience.
*   **Lead Generation:** Acquire email addresses of potential users (parents and kids) for future follow-up and marketing.
*   **Drive Engagement:** Offer an interactive element on the landing page to capture user interest.
*   **Promote Mobile App:** Serve as a teaser and promotional tool for the main mobile application.

## 2. Target Audience
*   **Primary:** Parents and children who are potential users of the mobile application being developed.
*   **Secondary:** Website visitors interested in understanding the core offering of the product quickly.

## 3. Product Requirements

### 3.1. Functional Requirements

#### 3.1.1. Micro-Lesson Module
*   **FR1: Swipe Navigation:** Users must be able to navigate through lesson slides/screens using a vertical swipe gesture (up and down).
*   **FR2: Preloaded Content:** The demo will feature one (1) preloaded micro-lesson. Content (text, images, etc.) will be provided.
*   **FR3: Lesson Structure:** The micro-lesson will consist of multiple distinct slides/screens.

#### 3.1.2. Quiz Module
*   **FR4: Quiz Presentation:** After completing the micro-lesson, users will be presented with 1-2 quiz questions related to the lesson content.
*   **FR5: Quiz Interaction:** Users must be able to select answers for the quiz questions.

#### 3.1.3. Email Collection & Results
*   **FR6: Email Prompt:** After completing the quiz, users will be prompted to enter their email address to receive their results.
*   **FR7: Email Submission:** The system must capture and store the submitted email address.
*   **FR8: Automated Email:** An automated email will be sent to the user's provided email address.
    *   The email must contain their quiz score/results.
    *   The email should include information about product pricing.
    *   The email may include a Limited Time Offer (LTO) or discount for the mobile app.

### 3.2. Non-Functional Requirements
*   **NFR1: Technology Stack:** To be built using the existing website stack: React, Next.js, and hosted on Vercel.
*   **NFR2: Responsiveness:** The UI must be responsive and function seamlessly on common web browsers and screen sizes.
*   **NFR3: Performance:** Swipe transitions and content loading should be smooth and fast to ensure a good user experience.
*   **NFR4: Analytics & Tracking:**
    *   Track the number of users starting the lesson.
    *   Track the lesson completion rate.
    *   Track the email submission rate.
    *   Track user progression through each slide/screen to identify potential drop-off points.

## 4. Design Considerations

*   **DC1: UI Inspiration:** The user interface design should draw inspiration from the existing hero-animation phone screen on the website, maintaining visual consistency.
*   **DC2: User Experience:** The experience should be intuitive, engaging, and easy to use for both parents and children.
*   **DC3: Branding:** Adhere to existing branding guidelines (colors, fonts, logo usage).
*   **DC4: Desktop Presentation:** On desktop views, the interactive demo should be presented within a visual mockup of an iPhone to simulate the mobile app experience.

## 5. Success Metrics

*   **SM1: Lesson Completion Rate:** Percentage of users who start the lesson and complete all slides.
*   **SM2: Email Submission Rate:** Percentage of users who complete the quiz and submit their email address.
*   **SM3: Slide Progression/Drop-off Rate:** Analytics on how many users reach each slide of the micro-lesson, identifying points where users abandon the demo.
*   **SM4: Click-through Rate (from Email):** (If applicable) Track clicks on links within the results email (e.g., to pricing page, app store).

## 6. Future Considerations (Optional)
*   Expansion to include multiple micro-lessons.
*   A/B testing of different quiz questions or LTOs.
*   Personalization of email content based on quiz performance. 

## 7. Implementation Plan & Action Items

### 7.1. Project Setup & Configuration
- [x] Initialize a new feature branch in the Git repository.
- [x] Set up any necessary environment variables (e.g., for email service API keys).
- [x] Confirm Next.js project structure and identify or create appropriate directories for new components.

### 7.2. Frontend Development (UI/UX)

#### 7.2.1. Core UI Components & Styling
- [x] Design and develop the main container for the interactive demo, ensuring it fits within the existing website layout.
- [x] Implement base styling adhering to `DC1` (hero-animation inspiration) and `DC3` (branding).
- [x] Ensure the UI is responsive across common devices (`NFR2`).

#### 7.2.2. Micro-Lesson Module
- [ ] Develop the swipe navigation component for vertical swiping between lesson slides (`FR1`).
- [ ] Create reusable "Slide" components to display lesson content.
- [ ] Populate the first micro-lesson with the provided content (text, images, etc.) (`FR2`, `FR3`).
- [ ] Ensure smooth transitions and fast content loading (`NFR3`).

#### 7.2.3. Quiz Module
- [ ] Design and develop the UI for presenting quiz questions (`FR4`).
- [ ] Implement interactive elements for answer selection (e.g., buttons, radio inputs) (`FR5`).
- [ ] Develop logic to evaluate quiz answers.

#### 7.2.4. Email Collection Form
- [ ] Design and develop the email input form that appears after quiz completion (`FR6`).
- [ ] Implement client-side validation for the email input field.

### 7.3. Backend Development

#### 7.3.1. Email Submission & Storage
- [ ] Create an API endpoint (e.g., Next.js API route) to receive the submitted email address and quiz results (`FR7`).
- [ ] Implement logic to securely store the collected email addresses (consider database or other storage solution).

#### 7.3.2. Automated Email Sending
- [ ] Integrate an email sending service (e.g., SendGrid, Mailgun, AWS SES).
- [ ] Develop the email template for sending quiz results (`FR8`).
    - [ ] Include quiz score/results.
    - [ ] Include product pricing information.
    - [ ] Include any LTO/discount information.
- [ ] Implement the backend logic to trigger the automated email upon successful email submission.

### 7.4. Analytics & Tracking (`NFR4`)
- [ ] Integrate an analytics solution (if not already present) or utilize existing tools.
- [ ] Implement tracking for users starting the lesson.
- [ ] Implement tracking for lesson completion.
- [ ] Implement tracking for email submission.
- [ ] Implement tracking for progression through each slide/screen.
- [ ] (Optional) Implement tracking for click-through rates from the results email (`SM4`).

### 7.5. Testing & Quality Assurance (QA)
- [ ] Conduct unit tests for individual components (UI and backend logic).
- [ ] Perform integration testing to ensure all parts work together (lesson -> quiz -> email form -> email sending).
- [ ] Test UI responsiveness and cross-browser compatibility (`NFR2`).
- [ ] Test swipe functionality and performance on various devices (`NFR3`).
- [ ] Verify email content and delivery.
- [ ] Verify analytics tracking is working correctly.

### 7.6. Deployment
- [ ] Merge the feature branch into the main development/production branch.
- [ ] Deploy the updated website to Vercel (`NFR1`).
- [ ] Monitor the feature post-deployment for any issues. 