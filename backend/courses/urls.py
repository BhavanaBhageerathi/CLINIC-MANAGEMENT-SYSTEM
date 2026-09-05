from django.urls import path
from .views import CourseListCreateView, CourseDetailView

urlpatterns = [
    path("", CourseListCreateView.as_view()),
    path("<int:course_id>", CourseDetailView.as_view()),
    path("<int:course_id>/fee", CourseDetailView.as_view()),
]