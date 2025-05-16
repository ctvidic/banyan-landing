## Implementation Steps (High-Level)
* Refactor the transcript drawer into a multi-tab drawer.
* Add state for the active tab.
* Add buttons for each tab below the call interface.
* Render the appropriate content in the drawer based on the active tab.
* Ensure the drawer is responsive for mobile and desktop.

## Accessibility & Usability
* Use clear icons/labels for each tab.
* Make sure the drawer can be closed easily.
* Ensure keyboard and screen reader accessibility.



## Detailed Step-by-Step Implementation Plan

1. **State Management**
   - Replace the `showTx` boolean with a new state variable, e.g., `activeDrawerTab`, which can be `"transcript" | "mission" | "tips" | null`.
   - Update all logic that toggles the transcript drawer to use this new state.

2. **Refactor Drawer Component**
   - Refactor the existing transcript drawer into a generic `Drawer` or `SidePane` component that can render different content based on the active tab.
   - The drawer should accept a prop or parameter to determine which tab/content to display.

3. **Tab Buttons UI**
   - Below the call interface, add a button for each tab: "Transcript", "Mission", and "Tips".
   - When a button is clicked, set `activeDrawerTab` to the corresponding value.
   - Highlight the active tab button for clarity.

4. **Drawer Content**
   - For the "Transcript" tab, render the existing transcript content.
   - For the "Mission" tab, render the scenario and goal (reuse content from `renderScenario`).
   - For the "Tips" tab, render static general negotiation tips (can be improved later for context-awareness).

5. **Drawer Responsiveness**
   - On desktop, keep the drawer as a right-side pane.
   - On mobile, make the drawer full-width or a bottom sheet for better usability.
   - Use CSS media queries or a responsive utility (e.g., Tailwind) to adjust the drawer layout.

6. **Drawer Close Functionality**
   - Add a close button/icon to the drawer.
   - Clicking the close button should set `activeDrawerTab` to `null`.

7. **Code Cleanup**
   - Remove the old `showTx` state and any now-unused transcript-specific logic.
   - Ensure all references to the drawer use the new multi-tab approach.

8. **Testing**
   - Test the drawer and tab switching on both desktop and mobile devices.
   - Ensure accessibility features (keyboard navigation, screen reader labels) are present.


