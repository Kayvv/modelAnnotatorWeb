export const lookupBioPortalTerm = async (curie, apiKey = 'f3265618-0488-40a4-be60-848b7de89142') => {
    // Handle underscore format (e.g., OPB_00318 -> OPB:00318)
    if (curie.includes('_')) {
        const parts = curie.split(':');
        curie = parts[0] + ':' + curie.split('_').pop();
    }

    const url = 'https://data.bioontology.org/search';
    const params = new URLSearchParams({
        q: curie,
        require_exact_match: 'true'
    });

    try {
        const response = await fetch(`${url}?${params}`, {
            headers: {
                'Authorization': `apikey token=${apiKey}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.collection && data.collection.length > 0) {
                const entry = data.collection[0];
                return {
                    label: entry.prefLabel || '',
                    definition: entry.definition || [],
                    synonyms: entry.synonym || [],
                    id: entry['@id'] || '',
                    ontology: entry.links?.ontology || ''
                };
            } else {
                return { error: 'No match found' };
            }
        } else {
            return {
                error: 'Lookup failed',
                status: response.status
            };
        }
    } catch (error) {
        return {
            error: 'Network error',
            message: error.message
        };
    }
};