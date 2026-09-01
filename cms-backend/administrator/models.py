from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):

    class Role(models.TextChoices):
        STAFF = "staff", "Staff"
        DOCTOR = "doctor", "Doctor"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STAFF
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Staff(models.Model):

    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]

    DEPARTMENT_CHOICES = [
        ("Reception", "Reception"),
        ("Pharmacy", "Pharmacy"),
        ("Nursing", "Nursing"),
        ("Lab", "Lab"),
        ("Accounts", "Accounts"),
        ("Admin", "Admin"),
        ("Other", "Other"),
    ]

    BLOOD_GROUP_CHOICES = [
        ("A+", "A+"),
        ("A-", "A-"),
        ("B+", "B+"),
        ("B-", "B-"),
        ("AB+", "AB+"),
        ("AB-", "AB-"),
        ("O+", "O+"),
        ("O-", "O-"),
    ]
    STATUS_CHOICES = [
    ("Active", "Active"),
    ("On Leave", "On Leave"),
    ]
    # Staff ID
    staff_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )

    # Personal Information
    name = models.CharField(max_length=100)

    date_of_birth = models.DateField()

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES
    )

    blood_group = models.CharField(
        max_length=3,
        choices=BLOOD_GROUP_CHOICES,
        blank=True,
        null=True
    )

    # Contact Information
    phone = models.CharField(max_length=15)

    email = models.EmailField(
        unique=True
    )

    address = models.TextField(
        blank=True,
        null=True
    )

    emergency_contact = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    # Employment Information
    department = models.CharField(
        max_length=50,
        choices=DEPARTMENT_CHOICES
    )

    qualification = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    # Login Information
    username = models.CharField(
        max_length=100,
        unique=True
    )

    password = models.CharField(
        max_length=255
    )
    status = models.CharField(
    max_length=20,
    choices=STATUS_CHOICES,
    default="Active"
    )
    def save(self, *args, **kwargs):

        if not self.staff_id:
            last_staff = Staff.objects.order_by("-id").first()

            if last_staff:
                next_id = last_staff.id + 1
            else:
                next_id = 1

            self.staff_id = f"STF{next_id:03d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.staff_id} - {self.name}"

class Medicine(models.Model):

    TYPE_CHOICES = [
        ("Tablet", "Tablet"),
        ("Capsule", "Capsule"),
        ("Syrup", "Syrup"),
        ("Injection", "Injection"),
        ("Cream", "Cream"),
        ("Ointment", "Ointment"),
        ("Drops", "Drops"),
        ("Other", "Other"),
    ]

    # Medicine ID
    medicine_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )

    # Medicine Information
    medicine_name = models.CharField(
        max_length=150
    )

    medicine_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES
    )

    manufacturer_name = models.CharField(
        max_length=150
    )

    # Dates
    manufacture_date = models.DateField()

    expiry_date = models.DateField()

    # Pricing & Stock
    price_per_unit = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    stock_quantity = models.PositiveIntegerField(
        default=0
    )

    # Quantity
    quantity = models.PositiveIntegerField(
        default=0
    )

    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        if not self.medicine_id:

            last_medicine = Medicine.objects.order_by("-id").first()

            if last_medicine:
                next_id = last_medicine.id + 1
            else:
                next_id = 1

            self.medicine_id = f"MED{next_id:03d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.medicine_id} - {self.medicine_name}"

