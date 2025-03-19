export default class AniListClient {
    public static async GetMALId(aniListId: string): Promise<string | null> {
        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                query ($id: Int) {
                  Media(id: $id) {
                    idMal
                  }
                }
              `,
                variables: { id: parseInt(aniListId) },
            }),
        });

        if (!response.ok) {
            console.error(
                "AniList-Player: Could not fetch MyAnimeList id.",
                `HTTP ${response.status}`,
            );
            return null;
        }

        const animeInfo = await response.json();
        return animeInfo.data.Media.idMal;
    }
}
