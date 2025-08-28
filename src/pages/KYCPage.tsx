
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Upload, CheckCircle, Clock, XCircle } from 'lucide-react';

type KYCStep = 'personal' | 'documents' | 'verification' | 'complete';

export default function KYCPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<KYCStep>('personal');
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      dateOfBirth: '',
      nationality: 'British',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: 'United Kingdom',
      },
    },
    documents: {
      idDocument: null as File | null,
      utilityBill: null as File | null,
      facePhoto: null as File | null,
    },
  });

  const steps = [
    { id: 'personal', title: 'Personal Info', description: 'Basic information' },
    { id: 'documents', title: 'Documents', description: 'Upload documents' },
    { id: 'verification', title: 'Verification', description: 'Face verification' },
    { id: 'complete', title: 'Complete', description: 'Review and submit' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Show current KYC status if already submitted
  if (user?.kycStatus === 'under_review') {
    return (
      <div className="page-container mobile-safe-area">
        <TopNavigation />
        <main className="container-padding py-6">
          <div className="text-center space-y-6">
            <div className="inline-flex p-4 bg-brand-warning/10 rounded-full">
              <Clock className="h-8 w-8 text-brand-warning" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Verification Under Review
              </h2>
              <p className="text-muted-foreground">
                We're reviewing your documents. This usually takes 1-2 business days.
                We'll notify you once the review is complete.
              </p>
            </div>
            <Button
              className="btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (user?.kycStatus === 'verified') {
    return (
      <div className="page-container mobile-safe-area">
        <TopNavigation />
        <main className="container-padding py-6">
          <div className="text-center space-y-6">
            <div className="inline-flex p-4 bg-brand-success/10 rounded-full">
              <CheckCircle className="h-8 w-8 text-brand-success" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Verification Complete
              </h2>
              <p className="text-muted-foreground">
                Your identity has been verified successfully. You can now send money.
              </p>
            </div>
            <Button
              className="btn-primary"
              onClick={() => navigate('/send')}
            >
              Send Money
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (user?.kycStatus === 'rejected') {
    return (
      <div className="page-container mobile-safe-area">
        <TopNavigation />
        <main className="container-padding py-6">
          <div className="text-center space-y-6">
            <div className="inline-flex p-4 bg-brand-error/10 rounded-full">
              <XCircle className="h-8 w-8 text-brand-error" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Verification Rejected
              </h2>
              <p className="text-muted-foreground">
                Your documents were rejected. Please resubmit with clearer images.
              </p>
            </div>
            <Button
              className="btn-primary"
              onClick={() => setCurrentStep('personal')}
            >
              Restart Verification
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep === 'personal') {
      if (!validatePersonalInfo()) return;
      setCurrentStep('documents');
    } else if (currentStep === 'documents') {
      if (!validateDocuments()) return;
      setCurrentStep('verification');
    } else if (currentStep === 'verification') {
      setCurrentStep('complete');
    } else if (currentStep === 'complete') {
      handleSubmit();
    }
  };

  const validatePersonalInfo = () => {
    const { personalInfo } = formData;
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.dateOfBirth) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (!personalInfo.address.street || !personalInfo.address.city || !personalInfo.address.postalCode) {
      toast.error('Please complete your address information');
      return false;
    }
    return true;
  };

  const validateDocuments = () => {
    const { documents } = formData;
    if (!documents.idDocument || !documents.utilityBill) {
      toast.error('Please upload all required documents');
      return false;
    }
    return true;
  };

  const handleFileUpload = (type: keyof typeof formData.documents, file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: file,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateUser({ kycStatus: 'under_review' });
      toast.success('KYC documents submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to submit KYC documents');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="form-label">First Name</Label>
                    <Input
                      value={formData.personalInfo.firstName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          firstName: e.target.value,
                        },
                      }))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <Label className="form-label">Last Name</Label>
                    <Input
                      value={formData.personalInfo.lastName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          lastName: e.target.value,
                        },
                      }))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <Label className="form-label">Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        dateOfBirth: e.target.value,
                      },
                    }))}
                    className="form-input"
                  />
                </div>

                <div>
                  <Label className="form-label">Street Address</Label>
                  <Input
                    value={formData.personalInfo.address.street}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        address: {
                          ...prev.personalInfo.address,
                          street: e.target.value,
                        },
                      },
                    }))}
                    className="form-input"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="form-label">City</Label>
                    <Input
                      value={formData.personalInfo.address.city}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          address: {
                            ...prev.personalInfo.address,
                            city: e.target.value,
                          },
                        },
                      }))}
                      className="form-input"
                      placeholder="London"
                    />
                  </div>
                  <div>
                    <Label className="form-label">Postal Code</Label>
                    <Input
                      value={formData.personalInfo.address.postalCode}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          address: {
                            ...prev.personalInfo.address,
                            postalCode: e.target.value,
                          },
                        },
                      }))}
                      className="form-input"
                      placeholder="SW1A 1AA"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="form-label">ID Document (Passport or Driver's License)</Label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                        <label className="relative cursor-pointer rounded-md font-semibold text-brand-primary">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('idDocument', file);
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-muted-foreground">PNG, JPG up to 10MB</p>
                      {formData.documents.idDocument && (
                        <p className="mt-2 text-sm font-medium text-brand-success">
                          ✓ {formData.documents.idDocument.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="form-label">Utility Bill (Last 3 months)</Label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                        <label className="relative cursor-pointer rounded-md font-semibold text-brand-primary">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('utilityBill', file);
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-muted-foreground">PNG, JPG up to 10MB</p>
                      {formData.documents.utilityBill && (
                        <p className="mt-2 text-sm font-medium text-brand-success">
                          ✓ {formData.documents.utilityBill.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Face Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Take a selfie to verify your identity. Make sure your face is clearly visible and matches your ID document.
                </p>
                
                <div className="flex justify-center rounded-lg border border-dashed border-border p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                      <label className="relative cursor-pointer rounded-md font-semibold text-brand-primary">
                        <span>Take Photo</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          capture="user"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('facePhoto', file);
                          }}
                        />
                      </label>
                    </div>
                    {formData.documents.facePhoto && (
                      <p className="mt-2 text-sm font-medium text-brand-success">
                        ✓ Photo captured
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-brand-success/10 rounded-full">
                <CheckCircle className="h-8 w-8 text-brand-success" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Ready to Submit
                </h2>
                <p className="text-muted-foreground">
                  Please review your information before submitting
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Verification Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Personal Info:</span>
                  <span className="text-brand-success">✓ Complete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Document:</span>
                  <span className="text-brand-success">✓ Uploaded</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Utility Bill:</span>
                  <span className="text-brand-success">✓ Uploaded</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Face Photo:</span>
                  <span className={formData.documents.facePhoto ? "text-brand-success" : "text-muted-foreground"}>
                    {formData.documents.facePhoto ? "✓ Captured" : "Optional"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="card-primary p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Our team will review your documents within 1-2 business days. 
                You'll receive an email notification once the review is complete.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="page-container mobile-safe-area">
      <TopNavigation />
      
      <main className="container-padding py-6 space-y-6">
        {/* Progress */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">
              {steps[currentStepIndex].title}
            </h2>
            <span className="text-sm text-muted-foreground">
              {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {steps[currentStepIndex].description}
          </p>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          {currentStepIndex > 0 && (
            <Button 
              variant="outline" 
              onClick={() => {
                const prevStep = steps[currentStepIndex - 1].id as KYCStep;
                setCurrentStep(prevStep);
              }}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button 
            onClick={handleNext} 
            className="btn-primary flex-1"
          >
            {currentStep === 'complete' ? 'Submit for Review' : 'Next'}
          </Button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
