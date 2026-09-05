from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Course
from .serializers import CourseSerializer


class CourseListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)

        return Response(serializer.data)

    def post(self, request):

        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = CourseSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class CourseDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, course_id):
        try:
            return Course.objects.get(course_id=course_id)
        except Course.DoesNotExist:
            return None

    def put(self, request, course_id):

        course = self.get_object(course_id)

        if course is None:
            return Response(
                {"detail": "Course not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CourseSerializer(
            course,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, course_id):

        course = self.get_object(course_id)

        if course is None:
            return Response(
                {"detail": "Course not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        course_fee = request.data.get("course_fee")

        if course_fee is None:
            return Response(
                {"detail": "course_fee is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        course.course_fee = course_fee
        course.save()

        serializer = CourseSerializer(course)

        return Response(serializer.data)

    def delete(self, request, course_id):

        course = self.get_object(course_id)

        if course is None:
            return Response(
                {"detail": "Course not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        course.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )