import { defineStore } from "pinia";
import RatingApi from "@/api/rating";

export const useRatingStore = defineStore("rating", {
  state: () => ({
    statistics: {
      total_ratings: 0,
      average_rating: 0,
      approved_ratings: 0,
      pending_ratings: 0,
      rating_distribution: {},
    },
    ratings: [],
    meta: {
      total: 0,
      current_page: 1,
      last_page: 1,
      per_page: 10,
    },
    loading: false,
    initialized: false,
  }),

  actions: {
    async fetchStatistics() {
      try {
        const { data } = await RatingApi.getRatingStatistics();
        this.statistics = data;
      } catch (e) {
        console.error("Gagal fetch statistics:", e);
        throw e;
      }
    },

    async fetchRatings(filters = {}, page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          per_page: 10,
          ...filters
        };
        const { data } = await RatingApi.getAdminList(params);
        console.log("fetch ratings data:", data);
        this.ratings = data.data;
        this.meta = data.meta;
        this.initialized = true;
        return data;
      } catch (e) {
        console.error("Gagal fetch ratings:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchRatingDetail(ratingId) {
      try {
        const response = await RatingApi.getRatingDetail(ratingId)
        return response.data || response
      } catch (e) {
        console.error("Gagal fetch rating detail:", e)
        throw e
      }
    },

    async updateRatingApproval(ratingId, isApproved) {
      try {
        const { data } = await RatingApi.updateRatingApproval(ratingId, { is_approved: isApproved });
        return data;
      } catch (e) {
        console.error("Gagal update rating approval:", e);
        throw e;
      }
    },

    async deleteRating(ratingId) {
      try {
        await RatingApi.deleteRating(ratingId);
      } catch (e) {
        console.error("Gagal delete rating:", e);
        throw e;
      }
    },

    reset() {
      this.ratings = [];
      this.meta = {
        total: 0,
        current_page: 1,
        last_page: 1,
        per_page: 10,
      };
      this.loading = false;
      this.initialized = false;
    }
  },

  getters: {
    hasRatings: (state) => state.ratings.length > 0,
    totalPages: (state) => state.meta.last_page,
    currentPage: (state) => state.meta.current_page,
    totalItems: (state) => state.meta.total,
    showLoading: (state) => state.loading && !state.initialized,
  }
});
