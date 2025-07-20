from prometheus_client import Counter, Gauge, Histogram, Summary
import contextlib
import time

class MetricsManager:
    def __init__(self):
        # Camera Metrics
        self.active_cameras = Gauge(
            'camera_streams_active',
            'Number of currently active camera streams'
        )
        
        self.frame_processing_time = Histogram(
            'frame_processing_duration_seconds',
            'Time spent processing each frame',
            ['camera_id', 'model_type'],
            buckets=(0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0)
        )

        # Detection Metrics
        self.detections_total = Counter(
            'object_detections_total',
            'Total number of detections',
            ['camera_id', 'class_name', 'model_type']
        )

        self.detection_confidence = Summary(
            'detection_confidence',
            'Confidence scores of detections',
            ['camera_id', 'class_name', 'model_type']
        )

        # Error Metrics
        self.errors_total = Counter(
            'detection_errors_total',
            'Total number of detection errors',
            ['camera_id', 'error_type', 'component']
        )

    @contextlib.contextmanager
    def measure_latency(self, camera_id: str, model_type: str):
        """Context manager to measure processing time"""
        start_time = time.perf_counter()
        try:
            yield
        finally:
            duration = time.perf_counter() - start_time
            self.frame_processing_time.labels(
                camera_id=camera_id,
                model_type=model_type
            ).observe(duration)

    def record_detection(self, camera_id: str, class_name: str, 
                        model_type: str, confidence: float):
        """Record a detection with its confidence"""
        self.detections_total.labels(
            camera_id=camera_id,
            class_name=class_name,
            model_type=model_type
        ).inc()

        self.detection_confidence.labels(
            camera_id=camera_id,
            class_name=class_name,
            model_type=model_type
        ).observe(confidence)

    def record_error(self, camera_id: str, error_type: str, component: str):
        """Record an error event"""
        self.errors_total.labels(
            camera_id=camera_id,
            error_type=error_type,
            component=component
        ).inc()

# Create a global metrics instance
metrics = MetricsManager()
