import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Clinical', value: 'clinical' },
          { title: 'Research', value: 'research' },
          { title: 'Patient', value: 'patient' },
          { title: 'Industry', value: 'industry' },
          { title: 'Regulatory', value: 'regulatory' },
          { title: 'Company', value: 'company' },
        ],
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'link',
      title: 'Link (URL)',
      type: 'url',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'publicationDate',
      title: 'Publication Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: Rule => Rule.required()
    }),
  ],
})

