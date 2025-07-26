import { useState } from 'react';
import { useUploadImage } from '../../utils';
import { useCreateSuggestionMutation } from '../../features/suggestions.api';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Submit = () => {
  const { t } = useTranslation();
  const [createSuggestion] = useCreateSuggestionMutation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadedFeaturedImage, setUploadedFeaturedImage] =
    useState<File | null>(null);
  const [featuredImage, isUploadingFeaturedImage] = useUploadImage(
    uploadedFeaturedImage
  );

  const clearForm = () => {
    setTitle('');
    setContent('');
    setUploadedFeaturedImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();

    await createSuggestion({ title, content, featuredImage })
      .unwrap()
      .then(() => {
        clearForm();
        toast.success('Suggestion sent');
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-full mx-auto bg-white text-secondary md:gap-6"
    >
      <h2 className="text-secondary">{t('submitSuggestion')}</h2>

      <div className="">
        <label
          htmlFor="title"
          className="block text-sm uppercase tracking-wide text-secondary mb-2"
        >
          {t('title')}
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder-gray-500"
          placeholder={t('enterTitle')}
        />
      </div>

      <div className="">
        <label
          htmlFor="content"
          className="block text-sm uppercase tracking-wide mb-2"
        >
          {t('content')}
        </label>
        <textarea
          name="content"
          id="content"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full px-4 py-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder-gray-500"
          placeholder={`${t('addContent')}...`}
        ></textarea>
      </div>

      <div className="">
        <label
          htmlFor="featuredImage"
          className="block text-sm uppercase tracking-wide mb-2"
        >
          {isUploadingFeaturedImage
            ? `${t('uploading')}...`
            : t('featuredImage')}
        </label>
        <input
          type="file"
          name="featuredImage"
          id="featuredImage"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setUploadedFeaturedImage(e.target.files[0]);
            }
          }}
          required
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-primary hover:file:bg-primary hover:file:text-secondary cursor-pointer"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-[#0e0e0e] font-semibold py-2 px-4 rounded-md hover:bg-secondary hover:text-primary transition cursor-pointer"
        disabled={isUploadingFeaturedImage}
      >
        {isUploadingFeaturedImage ? (
          <div>
            <span>{t('uploadingFeaturedImage')}</span>{' '}
            <span className="loading loading-spinner loading-xs"></span>
          </div>
        ) : (
          t('send')
        )}
      </button>
    </form>
  );
};

export default Submit;
