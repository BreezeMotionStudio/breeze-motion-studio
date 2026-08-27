import React, {useEffect, useMemo, useState} from 'react'
import {Box, Button, Card, Dialog, Grid, Stack, Text, TextInput} from '@sanity/ui'
import {ImagesIcon} from '@sanity/icons'
import {useClient, useFormValue} from 'sanity'

type ProjectImage = {
  key: string
  url: string
  alt?: string
  assetId: string
  label: string
}

type AssetFromSource = {
  kind: 'assetDocumentId' | 'file'
  value: string | File
}

type Props = {
  onSelect: (assets: AssetFromSource[]) => void
  onClose: () => void
  dialogHeaderTitle?: React.ReactNode
}

// A dialog-based asset source (opened via the field's "Select" button, same
// as the built-in browse option) that shows only the images already belonging
// to the linked case study project — Behind the Scenes and Deliverables —
// with a search box to narrow the list, plus an upload option for anything new.
function ProjectImageSourceComponent({onSelect, onClose, dialogHeaderTitle}: Props) {
  const client = useClient({apiVersion: '2025-01-01'})
  const caseStudyRef = useFormValue(['caseStudy', '_ref']) as string | undefined
  const [images, setImages] = useState<ProjectImage[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!caseStudyRef) {
      setImages([])
      return
    }
    client
      .fetch<{bts: {assetId: string; url: string; alt?: string}[]; deliverables: {assetId: string; url: string; alt?: string}[]}>(
        `*[_id == $id][0]{
          "bts": btsImages[defined(asset)]{ "assetId": asset._ref, "url": asset->url, alt },
          "deliverables": deliverableImages[defined(asset)]{ "assetId": asset._ref, "url": asset->url, alt }
        }`,
        {id: caseStudyRef},
      )
      .then((res) => {
        const bts = (res?.bts ?? []).map((img, i) => ({
          key: `bts-${i}`,
          url: img.url,
          alt: img.alt,
          assetId: img.assetId,
          label: `Behind the Scenes ${i + 1}`,
        }))
        const deliverables = (res?.deliverables ?? []).map((img, i) => ({
          key: `deliverable-${i}`,
          url: img.url,
          alt: img.alt,
          assetId: img.assetId,
          label: `Deliverable ${i + 1}`,
        }))
        setImages([...bts, ...deliverables])
      })
      .catch(() => setImages([]))
  }, [caseStudyRef, client])

  const filtered = useMemo(
    () => images.filter((img) => img.label.toLowerCase().includes(query.toLowerCase())),
    [images, query],
  )

  function pick(img: ProjectImage) {
    onSelect([{kind: 'assetDocumentId', value: img.assetId}])
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    onSelect([{kind: 'file', value: file}])
  }

  return (
    <Dialog
      id="project-image-source"
      header={dialogHeaderTitle || "Choose from this project's images"}
      onClose={onClose}
      width={2}
      open
    >
      <Box padding={4}>
        <Stack space={4}>
          {!caseStudyRef && (
            <Text size={1} muted>
              Link a Featured Case Study on this document first, then reopen this to browse its images.
            </Text>
          )}

          {caseStudyRef && (
            <>
              <TextInput
                placeholder="Search Behind the Scenes / Deliverables…"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
              />

              {filtered.length > 0 ? (
                <Grid columns={4} gap={2}>
                  {filtered.map((img) => (
                    <Card
                      key={img.key}
                      radius={2}
                      overflow="hidden"
                      tone="transparent"
                      style={{cursor: 'pointer', aspectRatio: '1', position: 'relative'}}
                      onClick={() => pick(img)}
                      title={img.label}
                    >
                      <img
                        src={`${img.url}?w=200&h=200&fit=crop`}
                        alt={img.alt || img.label}
                        style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                      />
                    </Card>
                  ))}
                </Grid>
              ) : (
                <Text size={1} muted>
                  {images.length === 0
                    ? 'This project has no Behind the Scenes or Deliverable images yet.'
                    : 'No images match that search.'}
                </Text>
              )}
            </>
          )}

          <Card borderTop paddingTop={4}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Or upload a new image
              </Text>
              <Button
                as="label"
                mode="ghost"
                text="Choose file…"
                style={{cursor: 'pointer'}}
              >
                <input type="file" accept="image/*" onChange={handleUpload} style={{display: 'none'}} />
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </Dialog>
  )
}

export const projectImageAssetSource = {
  name: 'project-images',
  title: 'From Project',
  component: ProjectImageSourceComponent,
  icon: ImagesIcon,
}
