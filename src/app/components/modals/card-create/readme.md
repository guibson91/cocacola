# Card Create Component

## Overview

The Card Create Component is a secure, reusable modal interface for capturing and registering credit card information within the application. This component follows PCI DSS (Payment Card Industry Data Security Standard) compliance guidelines by implementing client-side encryption before transmitting sensitive card data.

![Card Create Component](https://via.placeholder.com/800x400?text=Card+Create+Component)

## Table of Contents

- [Business Purpose](#business-purpose)
- [User Experience](#user-experience)
- [Technical Specifications](#technical-specifications)
- [Security Implementation](#security-implementation)
- [Dependencies](#dependencies)
- [API Integration](#api-integration)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Performance Considerations](#performance-considerations)

## Business Purpose

The Card Create Component enables users to securely register credit/debit cards for future payments without storing raw card data in the application's database. This component serves as a critical entry point for the payment flow, allowing customers to:

- Register multiple payment methods
- Use cards for future transactions without re-entering data
- Comply with financial regulations regarding card data storage

## User Experience

The component presents a clear, intuitive form that guides users through the card registration process. Key UX features include:

- Real-time input validation with error messages
- Automatic formatting of card numbers, expiration dates, and document numbers
- Responsive design for various screen sizes
- Accessible form fields with appropriate input types for mobile keyboard optimization

## Technical Specifications

### Component Architecture

- **Type**: Angular Modal Component
- **Base Class**: Extends `BaseModalComponent`
- **State Management**: Form-based with Angular Reactive Forms
- **Styling**: SCSS with Ionic Framework components

### Key Features

- Form validation for all input fields
- Credit card number validation using Luhn algorithm
- CPF/CNPJ (Brazilian tax ID) validation
- Expiration date validation
- Input masking for formatted data entry
- AES encryption of card data

### Code Structure

```typescript
// Key form fields
form = this.fb.group({
  name: ["", Validators.required],
  cardNumber: ["", [Validators.required, creditCardValidator()]],
  expirationDate: ["", [Validators.required, expirationDateValidator()]],
  securityCode: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
  cpfCnpj: ["", [Validators.required, cpfCnpjValidator()]],
});
```

## Security Implementation

Card data security is implemented using the following approach:

1. **Client-side encryption**: All sensitive card data is encrypted using AES encryption before transmission
2. **No plain text storage**: Raw card details are never stored in application storage or databases
3. **Encrypted transmission**: Data is sent to backend services in encrypted format only
4. **Key management**: Encryption keys are managed securely and never exposed in client code

### Encryption Process

```typescript
// Example of the encryption implementation
getEncryptedCard() {
  const form = this.form.value;
  // Format and encrypt card data
  // ...
  return encryptedCard;
}
```

## Dependencies

- **@angular/core**: Core Angular framework
- **@angular/forms**: Angular Reactive Forms
- **@ionic/angular**: Ionic UI components
- **@maskito/core**: Input masking library
- **crypto-js**: AES encryption library

## API Integration

The component integrates with the backend API using the following endpoint:

- **Endpoint**: `register/cards`
- **Method**: POST
- **Payload**: `{ card: encryptedCardData }`
- **Response**: Status indicator and message

## Usage Examples

### Opening the Modal

```typescript
async presentCardCreateModal() {
  const modal = await this.modalController.create({
    component: CardCreateComponent,
    cssClass: 'card-create-modal'
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data === 'success') {
    // Handle successful card registration
  }
}
```

## Testing

This component includes comprehensive testing coverage:

- **Unit Tests**: Tests for form validation, encryption logic, and API interaction
- **Integration Tests**: Modal presentation and dismissal flows
- **Security Tests**: Verification of encryption implementation
- **Accessibility Tests**: Ensuring the form meets accessibility standards

## Performance Considerations

- Encryption is performed asynchronously to prevent UI blocking
- Form validation is optimized to minimize re-renders
- Input masking is implemented efficiently to handle real-time formatting without performance impact
