// Custom appearance for Clerk components
const clerkAppearance = {
  baseTheme: [
    {
      variables: {
        colorPrimary: '#6366f1',
        colorBackground: '#1f2937',
        colorText: 'white',
        colorTextSecondary: '#9ca3af',
        colorInputBackground: '#111827',
        colorInputText: 'white',
        borderRadius: '0.5rem',
        fontFamily: 'Inter, system-ui, sans-serif',
      }
    }
  ],
  elements: {
    rootBox: {
      width: '100%',
      marginBottom: '0',
      maxWidth: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box'
    },
    card: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      border: 'none',
      padding: 0,
      width: '100%',
      maxWidth: '100%'
    },
    headerTitle: {
      display: 'none', // Hide default title as we're using our own
    },
    headerSubtitle: {
      display: 'none', // Hide default subtitle as we're using our own
    },
    formButtonPrimary: {
      backgroundColor: '#4f46e5',
      '&:hover': {
        backgroundColor: '#4338ca',
      },
      borderRadius: '0.375rem',
      fontWeight: 500,
      textTransform: 'none',
      padding: '0.5rem 1rem',
      marginTop: '1rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      height: '38px',
      width: '100%',
      maxWidth: '100%',
      fontSize: '0.875rem'
    },
    formField: {
      marginBottom: '1rem',
      width: '100%', 
      maxWidth: '100%',
      boxSizing: 'border-box'
    },
    formFieldLabel: {
      color: '#d1d5db',
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '0.375rem'
    },
    formFieldInput: {
      borderColor: '#374151',
      borderRadius: '0.375rem',
      color: 'white',
      backgroundColor: '#111827',
      padding: '0.5rem 0.75rem',
      '&:hover': {
        borderColor: '#4b5563',
      },
      '&:focus': {
        borderColor: '#6366f1',
        boxShadow: 'none',
        outline: '1px solid rgba(99, 102, 241, 0.2)',
        outlineOffset: '0px'
      },
      height: '38px',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      fontSize: '0.875rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    formFieldAction: {
      color: '#6366f1',
      fontSize: '0.75rem',
      '&:hover': {
        color: '#4f46e5'
      },
      fontWeight: 500,
      marginTop: '0.25rem'
    },
    footerActionText: {
      color: '#9ca3af',
      fontSize: '0.875rem',
      marginTop: '1rem'
    },
    footerActionLink: {
      color: '#6366f1',
      '&:hover': {
        color: '#4f46e5',
      },
      fontWeight: 500
    },
    identityPreview: {
      borderRadius: '0.375rem',
      borderColor: '#374151',
      backgroundColor: '#111827',
      padding: '0.625rem',
      marginBottom: '1rem',
      maxWidth: '100%',
      boxSizing: 'border-box'
    },
    identityPreviewText: {
      color: 'white',
      fontSize: '0.875rem',
    },
    identityPreviewEditButton: {
      color: '#6366f1',
      '&:hover': {
        color: '#4f46e5'
      }
    },
    alert: {
      borderRadius: '0.375rem',
      borderColor: '#374151',
      backgroundColor: '#111827',
      padding: '0.625rem',
      marginBottom: '1rem',
      maxWidth: '100%',
      boxSizing: 'border-box'
    },
    alertText: {
      color: '#d1d5db',
      fontSize: '0.75rem',
    },
    // Social buttons styling improvements
    socialButtonsBlockButton: {
      backgroundColor: '#111827',
      borderColor: '#374151',
      '&:hover': {
        backgroundColor: '#1f2937',
        borderColor: '#4b5563',
      },
      borderRadius: '0.375rem',
      height: '42px',
      padding: '0.625rem 1.25rem',
      margin: '0.5rem 0',
      width: '100%',
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem'
    },
    socialButtonsBlockButtonText: {
      color: 'white',
      fontWeight: 500,
      fontSize: '0.875rem',
      textAlign: 'center'
    },
    socialButtonsProviderIcon: {
      width: '20px',
      height: '20px',
      flex: '0 0 auto'
    },
    socialButtonsIconButton: {
      width: '42px',
      height: '42px',
      backgroundColor: '#111827',
      borderColor: '#374151',
      borderRadius: '0.375rem',
      '&:hover': {
        backgroundColor: '#1f2937',
        borderColor: '#4b5563',
      },
      margin: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    socialButtonsIconButtonIconBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px'
    },
    socialButtonsBlockButtonIconBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px'
    },
    dividerLine: {
      backgroundColor: '#374151',
      marginTop: '1.5rem',
      marginBottom: '1.5rem',
      height: '1px'
    },
    dividerText: {
      color: '#9ca3af',
      padding: '0 0.75rem',
      fontSize: '0.75rem',
      backgroundColor: '#111827'
    },
    formFieldErrorText: {
      color: '#ef4444',
      fontSize: '0.75rem',
      marginTop: '0.25rem',
      marginBottom: '0.25rem'
    },
    formFieldSuccessText: {
      color: '#10b981',
      fontSize: '0.75rem',
      marginTop: '0.25rem',
      marginBottom: '0.25rem'
    },
    alternativeMethods: {
      marginTop: '1.25rem'
    },
    main: {
      padding: '0',
      maxWidth: '100%',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        boxSizing: 'border-box',
        maxWidth: '100%'
      }
    },
    form: {
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      padding: '0'
    },
    formFieldInputGroup: {
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    },
    formFieldRow: {
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    },
    otpCodeFieldInputs: {
      gap: '0.25rem',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    },
    formResendCodeLink: {
      fontSize: '0.75rem'
    },
    formHeaderTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: 'white',
      textAlign: 'center',
      marginBottom: '0.5rem',
    },
    formHeaderSubtitle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.875rem',
      textAlign: 'center',
      marginBottom: '1rem',
    },
    alternativeMethodsBlock: {
      marginTop: '1rem',
      marginBottom: '1rem',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    socialButtonsIconButtonsBlockContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '0.5rem',
      width: '100%'
    },
    // Fix header and footer alignment
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    footer: {
      marginTop: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  layout: {
    socialButtonsVariant: 'blockButton',
    socialButtonsPlacement: 'top',
    termsPageUrl: 'https://yoursite.com/terms',
    privacyPageUrl: 'https://yoursite.com/privacy'
  }
};

export default clerkAppearance;
