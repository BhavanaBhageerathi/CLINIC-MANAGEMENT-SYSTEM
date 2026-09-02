from rest_framework import serializers

from .models import Staff, Department, Medicine, LabTest


class StaffSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    class Meta:
        model = Staff

        fields = [
            "staff_id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "is_active",
            "created_at",
        ]

        read_only_fields = [
            "staff_id",
            "username",
            "first_name",
            "last_name",
            "email",
            "created_at",
        ]


class StaffCreateSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=150)
    first_name = serializers.CharField(
        max_length=150,
        required=False
    )
    last_name = serializers.CharField(
        max_length=150,
        required=False
    )
    email = serializers.EmailField(
        required=False
    )
    password = serializers.CharField(
        write_only=True
    )
    role = serializers.ChoiceField(
        choices=Staff.ROLE_CHOICES
    )
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.filter(is_active=True),
        required=False
    )
    consultation_fee = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False
    )
    is_active = serializers.BooleanField(
        default=True
    )

    def validate(self, data):

        role = data.get("role")

        if role == "DOCTOR":

            if not data.get("department"):
                raise serializers.ValidationError({
                    "department": "Department is required for a Doctor."
                })

            if data.get("consultation_fee") is None:
                raise serializers.ValidationError({
                    "consultation_fee":
                    "Consultation Fee is required for a Doctor."
                })

        return data

class StaffUpdateSerializer(serializers.Serializer):

    first_name = serializers.CharField(
        max_length=150,
        required=False
    )

    last_name = serializers.CharField(
        max_length=150,
        required=False
    )

    email = serializers.EmailField(
        required=False
    )

    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.filter(is_active=True),
        required=False
    )

    consultation_fee = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False
    )

    is_active = serializers.BooleanField(
        required=False
    )

    password = serializers.CharField(
        write_only=True,
        required=False
    )

    def validate(self, data):

        staff = self.instance

        if staff.role == "DOCTOR":

            department = data.get(
                "department",
                getattr(
                    getattr(staff, "doctor_profile", None),
                    "department",
                    None
                )
            )

            consultation_fee = data.get(
                "consultation_fee",
                getattr(
                    getattr(staff, "doctor_profile", None),
                    "consultation_fee",
                    None
                )
            )

            if not department:
                raise serializers.ValidationError({
                    "department":
                    "Department is required for a Doctor."
                })

            if consultation_fee is None:
                raise serializers.ValidationError({
                    "consultation_fee":
                    "Consultation Fee is required for a Doctor."
                })

        return data

class DepartmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Department

        fields = [
            "id",
            "name",
            "is_active",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]   

class MedicineSerializer(serializers.ModelSerializer):

    class Meta:
        model = Medicine

        fields = [
            "id",
            "name",
            "generic_name",
            "brand_name",
            "formulation",
            "strength",
            "unit",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

class LabTestSerializer(serializers.ModelSerializer):

    class Meta:
        model = LabTest

        fields = [
            "id",
            "test_code",
            "test_name",
            "category",
            "sample_type",
            "price",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]