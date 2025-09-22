# Template Loading Feature

This feature allows you to load predefined form templates directly from URL parameters.

## How to Use

### Basic Template Loading

To load a template, add the `template` parameter to the URL:

```
http://localhost:3000/builder?template=travel
```

This will load the first template from the `travel.json` file.

### Loading Specific Templates

Some template files contain multiple templates. To load a specific one, use both `template` and `key` parameters:

```
http://localhost:3000/builder?template=travel&key=flight_booking
```

This will load the `flight_booking` template from the `travel.json` file.

## Available Templates

### Travel Templates (`travel.json`)
- `flight_booking` - Flight booking form
- `hotel_booking` - Hotel reservation form
- `tour_reservation` - Tour booking form
- `travel_feedback` - Travel feedback form

### Other Template Categories
- `business.json` - Business-related forms
- `education.json` - Educational forms
- `event.json` - Event management forms
- `feedback.json` - Feedback forms
- `healthcare.json` - Healthcare forms
- `membership.json` - Membership forms
- `notifications.json` - Notification forms
- `real-estate.json` - Real estate forms
- `service.json` - Service forms
- `technical.json` - Technical forms
- `user-account.json` - User account forms

## URL Examples

```
# Load travel template (first template in file)
http://localhost:3000/builder?template=travel

# Load specific flight booking template
http://localhost:3000/builder?template=travel&key=flight_booking

# Load hotel booking template
http://localhost:3000/builder?template=travel&key=hotel_booking

# Load business template
http://localhost:3000/builder?template=business

# Load education template
http://localhost:3000/builder?template=education
```

## Features

- **Automatic Loading**: Templates are loaded automatically when the page loads
- **Loading State**: Shows a loading spinner while template is being fetched
- **Error Handling**: Gracefully handles template loading errors
- **Form Title**: Automatically sets the form title from the template
- **Component Structure**: Loads all components with their properties and styling

## Implementation Details

The template loading feature:

1. Checks for `template` and `key` URL parameters
2. Fetches the template JSON file from `/templates/{template}.json`
3. Converts template components to `FormComponentModel` instances
4. Updates the form builder store with the loaded components
5. Sets the form title from the template
6. Shows a loading state during the process

## Template File Structure

Template files are JSON files located in `/public/templates/` with the following structure:

```json
{
  "template_key": {
    "components": [
      {
        "id": "component-id",
        "label": "Component Label",
        "type": "component-type",
        "category": "form|content",
        "properties": { ... },
        "attributes": { ... },
        "validations": { ... }
      }
    ],
    "formTitle": "Form Title",
    "formDescription": "Form Description",
    "tags": ["tag1", "tag2"],
    "category": "template-category"
  }
}
``` 
