import http from '../utils/http';

interface SimilaritySearchFromDocsParams {
  content: string;

  projectId: string;

  size: number;
}

export const similaritySearchFromDocs = (params: SimilaritySearchFromDocsParams) => {
  const { projectId, content, size } = params;
  return http({
    url: `/project/${projectId}/similaritySearchFromDocs`,
    method: 'post',
    data: {
      content,
      size,
    },
  });
};

export const getProjectDetail = (projectId: string) =>
  http({
    url: `/project/${projectId}/detail`,
  });
