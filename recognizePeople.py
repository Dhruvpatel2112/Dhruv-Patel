from face_feature import FaceFeature
from align_custom import AlignCustom
from face_feature import FaceFeature
from mtcnn_detect import MTCNNDetect
from tf_graph import FaceRecGraph
from main import findPeople
FRGraph = FaceRecGraph()
MTCNNGraph = FaceRecGraph()
aligner = AlignCustom()
extract_feature = FaceFeature(FRGraph)
# scale_factor, rescales image for faster detection
face_detect = MTCNNDetect(MTCNNGraph, scale_factor=2)


def recognizeProcess(aligns, positions, rects, frame):
    features_arr = extract_feature.get_features(aligns)
    recog_data = findPeople(features_arr, positions)
    for (i, rect) in enumerate(rects):
            # draw bounding box for the face
        cv2.rectangle(frame, (rect[0], rect[1]),
                      (rect[2], rect[3]), (0, 0, 255))
        cv2.putText(frame, recog_data[i][0]+" - "+str(recog_data[i][1])+"%", (rect[0],
                                                                              rect[1]), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 1, cv2.LINE_AA)
