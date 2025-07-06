# Habit tracker APP (Single Page Application)

## Media responsiveness

App is mainly focused for mobile users. Also responsive for tablets and laptops.

## Key features for user

- Adding habits
- Editing habits
- Pausing habits tracking
- Toggling habit status (done/not done)
- Removing habits
- Dark mode
- Changing year and month via dropdown selectors
- Changing days of the selected yyyy-mm via button clicks on scrollable day navigation
- Manipulations with habits are synchronised. Change in one tab is present in another tab

## App logic

- Any habit pause is applied from the date it was paused to the future until resumed
- Habit unpausing is only available via paused habits menu
- Trying to pause habit which has active pause (not resumed) will result in error display
- Users are not allowed to make changes on future days
- Users can still look into future dates via date selectors or changing route in URL "/day/yyyy-mm-dd"
- Users are not allowed to add an empty, existing or longer than 20 characters habit name
- Users are not allowed to edit habit name to an empty, existing or
- When removing habit user needs to confirm or cancel his choice via popup modal

## Testing

### Unit tests

- Tests for habit container
- Tests for date button
- Tests for all main functions of app

### E2E tests

- Tests adding habits
- Tests for date navigations
- Tests for edit/pausing/toggling/removing

## Starting with the project

- `git clone https://github.com/TuringCollegeSubmissions/tompetro-WD2.3.1.5.git`
- `cd tompetro-WD2.3.1.5`
- `npm install`
- `npm run dev`
