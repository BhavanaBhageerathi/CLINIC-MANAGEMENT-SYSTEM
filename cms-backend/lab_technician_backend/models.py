from django.db import models


class LabTestResult(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("SAMPLE_COLLECTED", "Sample Collected"),
        ("PROCESSING", "Processing"),
        ("COMPLETED", "Completed"),
    ]

    prescribed_test = models.OneToOneField(
        "doctor_backend.PrescribedLabTest",
        on_delete=models.PROTECT,
        related_name="lab_result"
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    result = models.TextField(
        blank=True
    )

    technician_notes = models.TextField(
        blank=True
    )

    report_file = models.FileField(
        upload_to="lab_reports/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    completed_at = models.DateTimeField(
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.prescribed_test} - {self.status}"